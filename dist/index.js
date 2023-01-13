"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sh = exports.s = exports.db = exports.create = exports.add = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const commander_1 = require("commander");
const version_json_1 = require("./lib/version.json");
const Skeet = __importStar(require("./cli"));
const program = new commander_1.Command();
program
    .name('skeet')
    .description('CLI to Skeet TypeScript Serverless Framework')
    .version(version_json_1.version);
dotenv_1.default.config();
async function run() {
    console.log('running skeet!');
}
const add = async () => {
    const appName = process.argv[3] || '--help';
    console.log('creating skeet!');
};
exports.add = add;
const create = async () => {
    const appName = process.argv[3] || '';
    await Skeet.Create.cloneRepo(appName);
    await Skeet.Create.printEndroll(appName);
};
exports.create = create;
const db = async () => {
    await Skeet.runServer();
};
exports.db = db;
const s = async () => {
    await Skeet.runServer();
};
exports.s = s;
const sh = async () => {
    const command = process.argv[3] || '--help';
    console.log('run sh');
};
exports.sh = sh;
async function main() {
    try {
        program.command('run').action(run);
        program.command('create').action(exports.create);
        program.command('add').action(exports.add);
        program.command('s').action(exports.s);
        await program.parseAsync(process.argv);
    }
    catch (error) {
        console.log(error);
    }
}
main();
//# sourceMappingURL=index.js.map