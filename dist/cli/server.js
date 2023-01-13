"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const node_child_process_1 = require("node:child_process");
const runServer = async () => (0, node_child_process_1.exec)(`yarn dev`, (err, output) => {
    if (err) {
        console.error('could not execute command: ', err);
        return;
    }
    return true;
});
exports.runServer = runServer;
//# sourceMappingURL=server.js.map