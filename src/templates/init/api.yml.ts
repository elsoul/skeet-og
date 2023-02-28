import fs from 'fs'

export const apiYml = async (
  envString: string,
  memory: string,
  cpu: string,
  maxConcurrency: string,
  maxInstances: string,
  minInstances: string,
  hasLoadBalancer: boolean = false
) => {
  fs.mkdirSync('.github/workflows', { recursive: true })
  const filePath = `.github/workflows/api.yml`
  const allowUnauthenticated = hasLoadBalancer
    ? '--allow-unauthenticated'
    : '--no-allow-unauthenticated'
  const body = `name: Api
on:
  push:
    branches:
      - main
    paths:
      - 'apps/api/**'
      - '.github/workflows/api.yml'

jobs:
  build:
    runs-on: ubuntu-22.04

    services:
      db:
        image: postgres:14
        ports: ['5432:5432']
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

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
          PGHOST: 127.0.0.1
          PGUSER: postgres
          RACK_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:5432/skeet-api-test?schema=public
        run: |
          sudo apt-get -yqq install libpq-dev
          cd apps/api
          rm -f .env
          yarn install --jobs 4 --retry 3
          npx prisma generate
          npx prisma migrate dev --skip-seed
          yarn test

      - name: Configure Docker
        run: gcloud auth configure-docker --quiet

      - name: Build Docker container
        run: docker build -f ./apps/api/Dockerfile ./apps/api -t \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-api

      - name: Push to Container Resistory
        run: docker push \${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-api

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy skeet-\${{ secrets.SKEET_APP_NAME }}-api \\
            --service-account=\${{ secrets.SKEET_APP_NAME }}@\${{ secrets.SKEET_GCP_PROJECT_ID }}.iam.gserviceaccount.com \\
            --image=\${{ secrets.SKEET_CONTAINER_REGION }}/\${{ secrets.SKEET_GCP_PROJECT_ID }}/skeet-\${{ secrets.SKEET_APP_NAME }}-api \\
            --memory=${memory} \\
            --cpu=${cpu} \\
            --concurrency=${maxConcurrency} \\
            --max-instances=${maxInstances} \\
            --min-instances=${minInstances} \\
            --region=\${{ secrets.SKEET_GCP_REGION }} \\
            ${allowUnauthenticated} \\
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
