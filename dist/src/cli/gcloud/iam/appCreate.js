"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCreate = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const appCreate = async (projectId, region) => {
    const shCmd = [
        'gcloud',
        'app',
        'create',
        '--region',
        region,
        '--quiet',
        '--project',
        projectId,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.appCreate = appCreate;
//# sourceMappingURL=appCreate.js.map