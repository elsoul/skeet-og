import fs from 'fs'

export const webYml = async () => {
  fs.mkdirSync('.github/workflows', { recursive: true })
  const filePath = `.github/workflows/web.yml`
  const body = `name: Web

  on:
    push:
      branches:
        - main
  
  jobs:
    deploy:
      name: Deploy
      runs-on: ubuntu-latest
      steps:
        - name: Checkout Repository
          uses: actions/checkout@v2
        - name: Install Node.js
          uses: actions/setup-node@v2
          with:
            node-version: '18.14.2'
        - name: Install yarn and firebase tools
          run: npm i -g npm yarn firebase-tools
        - name: GitHub repository setting
          run: git config --global url."https://github.com".insteadOf ssh://git@github.com
        - name: Install dependencies
          run: yarn install --frozen-lockfile
        - name: Build App
          run: yarn build:production:web
        - name: Deploy to Firebase
          run: firebase deploy --token \${{ secrets.FIREBASE_DEPLOY_TOKEN }}
`

  return {
    filePath,
    body,
  }
}
