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
      'npm-run-all': '4.1.5',
    },
  }
  return {
    filePath,
    body,
  }
}
