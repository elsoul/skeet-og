"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchSQL = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const patchSQL = async (projectId, appName, activation = '', ips = '') => {
    const shCmd = [
        'gcloud',
        'sql',
        'instances',
        'patch',
        appName,
        '--project',
        projectId,
    ];
    if (activation === 'always' || 'NEVER') {
        shCmd.push('--activation-policy', activation);
    }
    ips ? shCmd.push('--assign-ip', '--authorized-networks', ips, '--quiet') : '';
    await (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.patchSQL = patchSQL;
//# sourceMappingURL=patchSQL.js.map