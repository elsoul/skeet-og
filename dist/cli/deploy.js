"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const child_process_1 = require("child_process");
const deploy = async () => {
    const childProcess = (0, child_process_1.spawn)('yarn', ['deploy']);
    childProcess.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
    });
};
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map