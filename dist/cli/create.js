"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create = void 0;
const node_child_process_1 = require("node:child_process");
var Create;
(function (Create) {
    Create.cloneRepo = async (appName) => (0, node_child_process_1.exec)(`gh repo clone elsoul/skeet-api ${appName}`, (err, output) => {
        if (err) {
            console.error('could not execute command: ', err);
            return;
        }
        return true;
    });
    Create.printEndroll = async (appName) => {
        const endroll = `
   _____ __ __ __________________
  / ___// //_// ____/ ____/_  __/
  \\__ \\/ ,<  / __/ / __/   / /   
 ___/ / /| |/ /___/ /___  / /    
/____/_/ |_/_____/_____/ /_/`;
        const welcomText = `
⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
$ cd ${appName}
$ yarn && yarn dev
Go To : http://localhost:4200/graphql
    `;
        console.log(endroll);
        console.log(welcomText);
    };
})(Create = exports.Create || (exports.Create = {}));
//# sourceMappingURL=create.js.map