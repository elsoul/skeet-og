"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
const child_process_1 = require("child_process");
const migrate = async () => {
    const childProcess = (0, child_process_1.spawn)('yarn', ['db:migrate']);
    childProcess.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
    });
};
exports.migrate = migrate;
//# sourceMappingURL=migrate.js.map