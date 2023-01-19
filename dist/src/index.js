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
exports.test = exports.s = exports.sqlIp = exports.sqlList = exports.sqlStart = exports.sqlStop = exports.sqlCreate = exports.migrate = exports.create = exports.deploy = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const commander_1 = require("commander");
const version_json_1 = require("./lib/version.json");
const Skeet = __importStar(require("./cli"));
const skeet_cloud_config_1 = require("../skeet-cloud.config");
const projectId = skeet_cloud_config_1.skeetCloudConfig.api.projectId || '';
const appName = skeet_cloud_config_1.skeetCloudConfig.api.appName || '';
const region = skeet_cloud_config_1.skeetCloudConfig.api.region || '';
const dbPassword = skeet_cloud_config_1.skeetCloudConfig.api.db.dbPassword || '';
const databaseVersion = skeet_cloud_config_1.skeetCloudConfig.api.db.databaseVersion || '';
const cpu = skeet_cloud_config_1.skeetCloudConfig.api.db.cpu || '';
const memory = skeet_cloud_config_1.skeetCloudConfig.api.db.memory || '';
const ips = skeet_cloud_config_1.skeetCloudConfig.api.db.whiteList;
const program = new commander_1.Command();
program
    .name('skeet')
    .description('CLI to Skeet TypeScript Serverless Framework')
    .version(version_json_1.version);
dotenv_1.default.config();
async function run() {
    await Skeet.getContainerRegion(region);
}
const deploy = async () => { };
exports.deploy = deploy;
const create = async (initAppName) => {
    await Skeet.init(initAppName);
};
exports.create = create;
const migrate = async () => {
    await Skeet.dbMigrate();
};
exports.migrate = migrate;
async function setupIam() {
    await Skeet.runEnableAllPermission(projectId);
    await Skeet.runAddAllRole(projectId, appName);
}
const sqlCreate = async () => {
    await Skeet.createSQL(projectId, appName, region, dbPassword, databaseVersion, cpu, memory);
};
exports.sqlCreate = sqlCreate;
const sqlStop = async () => {
    await Skeet.patchSQL(projectId, appName, 'NEVER');
};
exports.sqlStop = sqlStop;
const sqlStart = async () => {
    await Skeet.patchSQL(projectId, appName, 'always');
};
exports.sqlStart = sqlStart;
const sqlList = async () => {
    await Skeet.listSQL(projectId);
};
exports.sqlList = sqlList;
const sqlIp = async () => {
    await Skeet.patchSQL(projectId, appName, '', ips);
};
exports.sqlIp = sqlIp;
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
        program
            .command('create')
            .description('Create Skeet App')
            .argument('<initAppName>', 'Skeet App Name')
            .action(async (initAppName) => {
            await (0, exports.create)(initAppName);
        });
        program.command('migrate').action(exports.migrate);
        program.command('server').alias('s').action(exports.s);
        program.command('setup').action(setupIam);
        program.command('run').action(run);
        program.command('deploy').action(exports.deploy);
        program.command('db:migrate').action(exports.migrate);
        program.command('sql:create').action(exports.sqlCreate);
        program.command('sql:stop').action(exports.sqlStop);
        program.command('sql:start').action(exports.sqlStart);
        program.command('sql:list').action(exports.sqlList);
        program.command('sql:ip').action(exports.sqlIp);
        program.command('api:build').action(async () => {
            await Skeet.apiBuild(appName);
        });
        program.command('api:tag').action(async () => {
            await Skeet.apiTag(projectId, appName, region);
        });
        program.command('api:push').action(async () => {
            await Skeet.apiPush(projectId, appName, region);
        });
        program.command('api:deploy').action(async () => {
            await Skeet.apiDeploy(projectId, appName, region, memory, cpu);
        });
        program.command('test').action(exports.test);
        await program.parseAsync(process.argv);
    }
    catch (error) {
        console.log(error);
    }
}
main();
//# sourceMappingURL=index.js.map