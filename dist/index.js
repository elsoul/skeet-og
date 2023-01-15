#!/usr/bin/env node
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
exports.test = exports.s = exports.migrate = exports.create = exports.deploy = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const commander_1 = require("commander");
const version_json_1 = require("./lib/version.json");
const Skeet = __importStar(require("./cli"));
const logger_1 = require("./lib/logger");
const program = new commander_1.Command();
program
    .name('skeet')
    .description('CLI to Skeet TypeScript Serverless Framework')
    .version(version_json_1.version);
dotenv_1.default.config();
async function run() {
    logger_1.Logger.skeetAA();
}
const deploy = async () => {
    await Skeet.deploy();
};
exports.deploy = deploy;
const create = async () => {
    const appName = process.argv[3] || '';
    await Skeet.cloneRepo(appName);
};
exports.create = create;
const migrate = async () => {
    await Skeet.migrate();
};
exports.migrate = migrate;
const s = async () => {
    await Skeet.runServer();
};
exports.s = s;
const test = async () => {
    await Skeet.test();
};
exports.test = test;
async function main() {
    try {
        program.command('create').action(exports.create);
        program.command('migrate').action(exports.migrate);
        program.command('s').action(exports.s);
        program.command('run').action(run);
        program.command('deploy').action(exports.deploy);
        program.command('test').action(exports.test);
        await program.parseAsync(process.argv);
    }
    catch (error) {
        console.log(error);
    }
}
main();
//# sourceMappingURL=index.js.map