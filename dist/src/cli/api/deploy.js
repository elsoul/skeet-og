"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainerRegion = exports.apiDeploy = exports.apiPush = exports.apiTag = exports.apiBuild = void 0;
const execSyncCmd_1 = require("../../lib/execSyncCmd");
const apiBuild = async (appName) => {
    const imageName = appName + '-api';
    const shCmd = ['docker', 'build', './apps/api', '-t', imageName];
    (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.apiBuild = apiBuild;
const apiTag = async (projectId, appName, region) => {
    const cRegion = await (0, exports.getContainerRegion)(region);
    const imageName = appName + '-api';
    const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest';
    const shCmd = ['docker', 'tag', imageName, imageUrl];
    (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.apiTag = apiTag;
const apiPush = async (projectId, appName, region) => {
    const cRegion = await (0, exports.getContainerRegion)(region);
    const imageName = appName + '-api';
    const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest';
    const shCmd = ['docker', 'push', imageUrl];
    (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.apiPush = apiPush;
const apiDeploy = async (projectId, appName, region, memory, cpu) => {
    const cRegion = await (0, exports.getContainerRegion)(region);
    const imageName = appName + '-api';
    const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest';
    const shCmd = [
        'docker',
        'run',
        'deploy',
        imageName,
        '--image',
        imageUrl,
        '--memory',
        memory,
        '--cpu',
        cpu,
        '--quiet',
        '--region',
        region,
        '--allow-unauthenticated',
        '--platform',
        'managed',
        '--port',
        '8080',
        '--project',
        projectId,
    ];
    (0, execSyncCmd_1.execSyncCmd)(shCmd);
};
exports.apiDeploy = apiDeploy;
const getContainerRegion = async (region) => {
    switch (region) {
        case region.match('asia')?.input:
            return 'asia.gcr.io';
        case region.match('eu')?.input:
            return 'eu.gcr.io';
        default:
            return 'gcr.io';
    }
};
exports.getContainerRegion = getContainerRegion;
//# sourceMappingURL=deploy.js.map