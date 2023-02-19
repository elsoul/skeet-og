import fs from 'fs'

export const workerYml = async (
  workerName: string,
  envString: string,
  memory: string,
  cpu: string,
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

    services:
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
        run: docker build -f ./apps/workers/${workerName}/Dockerfile ./apps/workers/${workerName} -t \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-worker-\${{ secrets.SKEET_APP_NAME }}

      - name: Push to Container Resistory
        run: docker push \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-worker-\${{ secrets.SKEET_APP_NAME }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy skeet-worker-\${{ secrets.SKEET_APP_NAME }} \\
            --service-account=\${{ secrets.SKEET_APP_NAME }}@\${{ secrets.SKEET_GCP_PROJECT_ID }}.iam.gserviceaccount.com \\
            --image=\${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-worker-\${{ secrets.SKEET_APP_NAME }} \\
            --memory=${memory} \\
            --cpu=${cpu} \\
            --max-instances=${maxInstances} \\
            --min-instances=${minInstances} \\
            --region=\${{ secrets.SKEET_GCP_REGION }} \\
            --allow-unauthenticated \\
            --platform=managed \\
            --quiet \\
            --concurrency=80 \\
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
