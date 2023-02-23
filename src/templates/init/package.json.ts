export const packageJson = async (appName: string) => {
  const filePath = `${appName}/package.json`
  const body = {
    name: appName,
    version: '0.0.1',
    description: 'Skeet Full-stack TypeScript Serverless Framework',
    main: 'dist/index.js',
    repository: 'https://github.com/elsoul/skeet.git',
    author: 'ELSOUL LABO B.V.',
    license: 'Apache-2.0',
    private: true,
    scripts: {
      skeet: 'run-p skeet:*',
      'skeet:api': 'yarn --cwd ./apps/api dev',
    },
    devDependencies: {
      'prettier-plugin-prisma': '4.9.0',
      'npm-run-all': '4.1.5',
      '@types/express': '4.17.15',
      '@types/jest': '29.2.5',
      '@types/node': '18.11.18',
      '@types/node-fetch': '2.6.2',
      '@types/superagent': '4.1.16',
      '@types/supertest': '2.0.12',
      'babel-loader': '9.1.2',
      esbuild: '0.17.7',
      eslint: '8.31.0',
      'eslint-config-prettier': '8.6.0',
      jest: '29.3.1',
      nodemon: '2.0.20',
      'npm-check-updates': '16.6.2',
      prettier: '2.8.2',
      superagent: '8.0.6',
      supertest: '6.3.3',
      'ts-jest': '29.0.4',
      'ts-loader': '9.4.2',
      typescript: '4.9.4',
    },
  }
  return {
    filePath,
    body,
  }
}
