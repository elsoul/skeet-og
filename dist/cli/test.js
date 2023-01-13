"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const child_process_1 = require("child_process");
const test = async () => {
    const childProcess = (0, child_process_1.spawn)('yarn', ['test']);
    childProcess.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
    });
};
exports.test = test;
//# sourceMappingURL=test.js.map