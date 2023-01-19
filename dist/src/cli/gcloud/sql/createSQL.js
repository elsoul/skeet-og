"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSQL = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const createSQL = async (projectId, appName, region = 'europe-west4-b', dbPassword = 'postgres', databaseVersion = 'POSTGRES_14', cpu = '1', memory = '4096MB') => {
    const shCmd = [
        'gcloud',
        'sql',
        'instances',
        'create',
        appName,
        '--database-version',
        databaseVersion,
        '--cpu',
        cpu,
        '--memory',
        memory,
        '--region',
        region,
        '--project',
        projectId,
        '--root-password',
        dbPassword,
        '--database-flags',
        'cloudsql.iam_authentication=on',
    ];
    await (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.createSQL = createSQL;
//# sourceMappingURL=createSQL.js.map