"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execCmd = void 0;
const child_process_1 = require("child_process");
const execCmd = async (command, cwd = '.') => {
    let p = (0, child_process_1.spawn)(command[0], command.slice(1), { cwd });
    return new Promise((resolveFunc) => {
        p.stdout.on('data', (x) => {
            process.stdout.write(x.toString());
        });
        p.stderr.on('data', (x) => {
            process.stderr.write(x.toString());
        });
        p.on('exit', (code) => {
            resolveFunc(code);
        });
    });
};
exports.execCmd = execCmd;
//# sourceMappingURL=execCmd.js.map