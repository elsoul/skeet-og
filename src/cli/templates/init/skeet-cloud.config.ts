export const skeetCloudConfigGen = async (appName: string) => {
  const filePath = `${appName}/skeet-cloud.config.js`
  const body = `export const skeetCloudConfig = {
  api: {
    appName: ${appName},
    projectId: 'skeet-framework',
    region: 'europe-west4',
    cpu: '1',
    memory: '1Gi',
  },
}
`
  return {
    filePath,
    body,
  }
}
