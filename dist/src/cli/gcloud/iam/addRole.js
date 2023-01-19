"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleList = exports.addRole = exports.addAllRoles = exports.runAddAllRole = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const runAddAllRole = async (projectId, appName) => {
    await (0, exports.addAllRoles)(projectId, appName, exports.roleList);
};
exports.runAddAllRole = runAddAllRole;
const addAllRoles = async (projectId, appName, roleList) => {
    roleList.forEach(async (roleName) => {
        await (0, exports.addRole)(projectId, appName, roleName);
    });
};
exports.addAllRoles = addAllRoles;
const addRole = async (projectId, appName, roleName) => {
    const addRoleCmd = [
        'gcloud',
        'projects',
        'add-iam-policy-binding',
        projectId,
        '--member',
        `serviceAccount:${appName}@${projectId}.iam.gserviceaccount.com`,
        '--role',
        roleName,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(addRoleCmd);
};
exports.addRole = addRole;
exports.roleList = [
    'roles/cloudsql.editor',
    'roles/containerregistry.ServiceAgent',
    'roles/pubsub.editor',
    'roles/datastore.user',
    'roles/iam.serviceAccountUser',
    'roles/run.admin',
    'roles/storage.admin',
    'roles/storage.objectAdmin',
    'roles/cloudscheduler.admin',
    'roles/appengine.appCreator',
    'roles/logging.admin',
    'roles/cloudtranslate.admin',
];
//# sourceMappingURL=addRole.js.map