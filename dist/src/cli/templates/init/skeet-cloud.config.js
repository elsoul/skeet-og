"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeetCloudConfigGen = void 0;
const skeetCloudConfigGen = async (appName) => {
    const filePath = `${appName}/skeet-cloud.config.js`;
    const body = `export const skeetCloudConfig = {
  api: {
    appName: ${appName},
    projectId: 'skeet-framework',
    region: 'europe-west4',
    cpu: '1',
    memory: '1Gi',
    db: {
      databaseVersion: 'POSTGRES_14',
      dbPassword: process.env.DB_PASSWORD || '',
      cpu: '1',
      memory: '4096MB',
      whiteList: '',
    },
  },
}
`;
    return {
        filePath,
        body,
    };
};
exports.skeetCloudConfigGen = skeetCloudConfigGen;
//# sourceMappingURL=skeet-cloud.config.js.map