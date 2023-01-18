"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeetCloudConfigGen = void 0;
const skeetCloudConfigGen = async (appName) => {
    const filePath = `${appName}/skeet-cloud.config.js`;
    const body = `/** @type {import('skeet').skeetCloudConfig} */
export const skeetCloudConfig = {
  api: [
    {
      appName: ${appName},
      projectId: 'skeet-framework',
      region: 'europe-west4',
      cpu: '1',
      memory: '1Gi',
    },
  ],
}
`;
    return {
        filePath,
        body,
    };
};
exports.skeetCloudConfigGen = skeetCloudConfigGen;
//# sourceMappingURL=skeet-cloud.config.js.map