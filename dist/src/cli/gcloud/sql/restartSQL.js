"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restartSQL = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const restartSQL = async (projectId, appName) => {
    const shCmd = [
        'gcloud',
        'sql',
        'instances',
        'restart',
        appName,
        '--project',
        projectId,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.restartSQL = restartSQL;
//# sourceMappingURL=restartSQL.js.map