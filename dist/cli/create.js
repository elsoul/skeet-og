"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = void 0;
const logger_1 = require("../lib/logger");
const cloneRepo = async (appName) => {
    // const childProcess = spawn('gh', [
    //   'repo',
    //   'clone',
    //   'elsoul/skeet-api',
    //   appName,
    // ])
    // childProcess.stdout.on('data', (chunk) => {
    //   console.log(chunk.toString())
    // })
    await logger_1.Logger.skeetAA();
    await logger_1.Logger.welcomText(appName);
    await logger_1.Logger.cmText();
};
exports.cloneRepo = cloneRepo;
//# sourceMappingURL=create.js.map