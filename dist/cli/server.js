"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const child_process_1 = require("child_process");
const runServer = async () => {
    const childProcess = (0, child_process_1.spawn)('yarn', ['dev']);
    childProcess.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
    });
};
exports.runServer = runServer;
//# sourceMappingURL=server.js.map