import fs from 'fs'

export const workerYml = async (
  workerName: string,
  envString: string,
  memory: string,
  cpu: string,
  maxConcurrency: string,
  maxInstances: string,
  minInstances: string
) => {
  fs.mkdirSync('.github/workflows', { recursive: true })
  const filePath = `.github/workflows/worker-${workerName}.yml`
  const body = `name: ${workerName}Worker
on:
  push:
    branches:
      - main
    paths:
      - 'apps/workers/${workerName}/**'
      - '.github/workflows/worker-${workerName}.yml'

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18.14.0'

      - name: Checkout the repository
        uses: actions/checkout@v2

      - id: auth
        uses: google-github-actions/auth@v0
        with:
          credentials_json: \${{ secrets.SKEET_GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v0

      - name: Build and test
        env:
          NODE_ENV: test
        run: |
          sudo apt-get -yqq install libpq-dev
          cd apps/workers/${workerName}
          rm -f .env
          yarn install --jobs 4 --retry 3
          yarn test

      - name: Configure Docker
        run: gcloud auth configure-docker --quiet

      - name: Build Docker container
        run: docker build -f ./apps/workers/${workerName}/Dockerfile ./apps/workers/${workerName} -t \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-worker-${workerName}

      - name: Push to Container Resistory
        run: docker push \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-worker-${workerName}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy skeet-\${{ secrets.SKEET_APP_NAME }}-worker-${workerName} \\
            --service-account=\${{ secrets.SKEET_APP_NAME }}@\${{ secrets.SKEET_GCP_PROJECT_ID }}.iam.gserviceaccount.com \\
            --image=\${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-worker-${workerName} \\
            --memory=${memory} \\
            --cpu=${cpu} \\
            --concurrency=${maxConcurrency} \\
            --max-instances=${maxInstances} \\
            --min-instances=${minInstances} \\
            --ingress=internal \\
            --region=\${{ secrets.SKEET_GCP_REGION }} \\
            --platform=managed \\
            --quiet \\
            --port=8080 \\
            --vpc-connector="\${{ secrets.SKEET_APP_NAME }}-con" \\
            --vpc-egress=all \\
            --set-env-vars=${envString}
`

  return {
    filePath,
    body,
  }
}
