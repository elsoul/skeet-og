"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execSyncCmd = void 0;
const child_process_1 = require("child_process");
const execSyncCmd = async (command, cwd = '.') => {
    const result = (0, child_process_1.spawnSync)(command[0], command.slice(1), {
        cwd,
        stdio: 'inherit',
    });
    const _output = result.stderr;
};
exports.execSyncCmd = execSyncCmd;
//# sourceMappingURL=execSyncCmd.js.map