"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeetCloudConfig = void 0;
exports.skeetCloudConfig = {
    api: {
        appName: 'skeet-framework',
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
};
//# sourceMappingURL=skeet-cloud.config.js.map