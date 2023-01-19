"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceAccountKey = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const createServiceAccountKey = async (projectId, appName) => {
    const createServiceAccountCmd = [
        'gcloud',
        'iam',
        'service-accounts',
        'keys',
        'create',
        './keyfile.json',
        '--iam-account',
        `${appName}@${projectId}.iam.gserviceaccount.com`,
        '--project',
        projectId,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(createServiceAccountCmd);
};
exports.createServiceAccountKey = createServiceAccountKey;
//# sourceMappingURL=createServiceAccountKey.js.map