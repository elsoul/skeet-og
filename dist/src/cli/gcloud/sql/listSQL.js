"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSQL = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const listSQL = async (projectId) => {
    const shCmd = ['gcloud', 'sql', 'instances', 'list', '--project', projectId];
    await (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.listSQL = listSQL;
//# sourceMappingURL=listSQL.js.map