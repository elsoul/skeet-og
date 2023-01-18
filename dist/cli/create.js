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
exports.initDbMigrate = exports.runPsql = exports.createGitHubRepo = exports.generateInitFiles = exports.createApiDir = exports.init = void 0;
const logger_1 = require("../lib/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execCmd_1 = require("../lib/execCmd");
const fileDataOf = __importStar(require("./templates/init"));
const init = async (appName) => {
    const appDir = await (0, exports.createApiDir)(appName);
    const gitCloneCmd = ['gh', 'repo', 'clone', 'elsoul/skeet-api', appDir];
    await (0, execCmd_1.execCmd)(gitCloneCmd);
    const yarnCmd = ['yarn'];
    await (0, execCmd_1.execCmd)(yarnCmd, appDir);
    const rmDefaultGit = ['rm', '-rf', '.git'];
    await (0, execCmd_1.execCmd)(rmDefaultGit, appDir);
    await (0, exports.generateInitFiles)(appName);
    const createNetworkCmd = ['docker', 'network', 'create', 'skeet-network'];
    await (0, execCmd_1.execCmd)(createNetworkCmd);
    await (0, exports.runPsql)();
    await new Promise((r) => setTimeout(r, 2000));
    await (0, exports.initDbMigrate)(appDir);
    await logger_1.Logger.skeetAA();
    await logger_1.Logger.welcomText(appName);
    const nmb = Math.floor(Math.random() * 5);
    if (nmb === 5) {
        await logger_1.Logger.cmText();
    }
};
exports.init = init;
const createApiDir = async (appName) => {
    try {
        const apiDir = path_1.default.join(appName, '/apps/api');
        fs_1.default.mkdir(apiDir, { recursive: true }, (err) => {
            if (err)
                throw err;
        });
        return apiDir;
    }
    catch (error) {
        return `error: ${error}`;
    }
};
exports.createApiDir = createApiDir;
const generateInitFiles = async (appName) => {
    const apiDir = path_1.default.join(appName, '/apps/api');
    const packageJson = await fileDataOf.packageJson(appName);
    fs_1.default.writeFileSync(packageJson.filePath, JSON.stringify(packageJson.body, null, 2));
    const tsconfigJson = await fileDataOf.tsconfigJson(appName);
    fs_1.default.writeFileSync(tsconfigJson.filePath, JSON.stringify(tsconfigJson.body, null, 2));
    const eslintrcJson = await fileDataOf.eslintrcJson(appName);
    fs_1.default.writeFileSync(eslintrcJson.filePath, JSON.stringify(eslintrcJson.body, null, 2));
    const eslintignore = await fileDataOf.eslintignore(appName);
    fs_1.default.writeFileSync(eslintignore.filePath, eslintignore.body);
    const prettierrc = await fileDataOf.prettierrc(appName);
    fs_1.default.writeFileSync(prettierrc.filePath, JSON.stringify(prettierrc.body, null, 2));
    const skeetCloudConfigGen = await fileDataOf.skeetCloudConfigGen(appName);
    fs_1.default.writeFileSync(skeetCloudConfigGen.filePath, skeetCloudConfigGen.body);
    const prettierignore = await fileDataOf.prettierignore(appName);
    fs_1.default.writeFileSync(prettierignore.filePath, prettierignore.body);
    const gitignore = await fileDataOf.gitignore(appName);
    fs_1.default.writeFileSync(gitignore.filePath, gitignore.body);
    const rmDefaultEnv = ['rm', '.env'];
    await (0, execCmd_1.execCmd)(rmDefaultEnv, apiDir);
    const apiEnv = await fileDataOf.apiEnv(appName);
    fs_1.default.writeFileSync(apiEnv.filePath, apiEnv.body);
};
exports.generateInitFiles = generateInitFiles;
const createGitHubRepo = async (repoName, openSource = false) => {
    const publishType = openSource == true ? 'public' : 'private';
    const cmdLine = [
        'gh',
        'repo',
        'create',
        repoName,
        `--${publishType}`,
        '--push',
        '--souce=./',
        '--remote=upstream',
    ];
    await (0, execCmd_1.execCmd)(cmdLine);
};
exports.createGitHubRepo = createGitHubRepo;
const runPsql = async () => {
    const runPsqlCmd = [
        'docker',
        'run',
        '--restart',
        'always',
        '-d',
        '--name',
        'skeet-psql',
        '--network',
        'skeet-network',
        '-p',
        '5432:5432',
        '-v',
        'postres-tmp:/home/postgresql/data',
        '-e',
        'POSTGRES_USER=postgres',
        '-e',
        'POSTGRES_PASSWORD=postgres',
        '-e',
        'POSTGRES_DB=skeet-api-dev',
        'postgres:14-alpine',
    ];
    await (0, execCmd_1.execCmd)(runPsqlCmd);
    console.log('docker psql container is up!');
};
exports.runPsql = runPsql;
const initDbMigrate = async (apiDir) => {
    const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'dev', '--name', 'init'];
    await (0, execCmd_1.execCmd)(prismaMigrateCmd, apiDir);
};
exports.initDbMigrate = initDbMigrate;
//# sourceMappingURL=create.js.map