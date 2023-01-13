"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = void 0;
const node_child_process_1 = require("node:child_process");
const cloneRepo = async (appName) => {
    const childProcess = (0, node_child_process_1.spawn)('gh', [
        'repo',
        'clone',
        'elsoul/skeet-api',
        appName,
    ]);
    childProcess.stdout.on('data', (chunk) => {
        console.log(chunk.toString());
    });
    console.log(await printEndroll(appName));
};
exports.cloneRepo = cloneRepo;
const printEndroll = async (appName) => {
    return `
   _____ __ __ __________________
  / ___// //_// ____/ ____/_  __/
  \\__ \\/ ,<  / __/ / __/   / /   
 ___/ / /| |/ /___/ /___  / /    
/____/_/ |_/_____/_____/ /_/

⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
$ cd ${appName}
$ yarn && yarn dev
Go To : http://localhost:4200/graphql
  `;
};
//# sourceMappingURL=create.js.map