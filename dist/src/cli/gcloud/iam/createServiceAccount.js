"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceAccount = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const createServiceAccount = async (projectId, appName) => {
    const createServiceAccountCmd = [
        'gcloud',
        'iam',
        'service-accounts',
        'create',
        appName,
        "--description='Skeet Service Account'",
        `--display-name=${appName}`,
        '--project',
        projectId,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(createServiceAccountCmd);
};
exports.createServiceAccount = createServiceAccount;
//# sourceMappingURL=createServiceAccount.js.map