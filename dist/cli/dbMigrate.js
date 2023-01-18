"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbMigrate = void 0;
const execCmd_1 = require("../lib/execCmd");
const path_1 = __importDefault(require("path"));
const dbMigrate = async () => {
    const currentDirArray = process.cwd().split('/');
    const currentDir = currentDirArray[currentDirArray.length - 1];
    const apiDir = path_1.default.join(currentDir, '/apps/api');
    const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'deploy'];
    await (0, execCmd_1.execCmd)(prismaMigrateCmd, apiDir);
};
exports.dbMigrate = dbMigrate;
//# sourceMappingURL=dbMigrate.js.map