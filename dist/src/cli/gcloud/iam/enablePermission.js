"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceList = exports.enablePermission = exports.enableServiceListPermission = exports.runEnableAllPermission = void 0;
const execSyncCmd_1 = require("../../../lib/execSyncCmd");
const logger_1 = require("../../../lib/logger");
const runEnableAllPermission = async (projectId) => {
    await (0, exports.enableServiceListPermission)(projectId, exports.serviceList);
};
exports.runEnableAllPermission = runEnableAllPermission;
const enableServiceListPermission = async (projectId, serviceList) => {
    serviceList.forEach(async (serviceName) => {
        await (0, exports.enablePermission)(projectId, serviceName);
        await new Promise((r) => setTimeout(r, 1000));
        logger_1.Logger.success(`added ${serviceName}!`);
    });
};
exports.enableServiceListPermission = enableServiceListPermission;
const enablePermission = async (projectId, serviceName) => {
    const serviceEnableCmd = [
        'gcloud',
        'services',
        'enable',
        serviceName,
        '--project',
        projectId,
    ];
    await (0, execSyncCmd_1.execSyncCmd)(serviceEnableCmd);
};
exports.enablePermission = enablePermission;
exports.serviceList = [
    'compute.googleapis.com',
    'iam.googleapis.com',
    'dns.googleapis.com',
    'sqladmin.googleapis.com',
    'sql-component.googleapis.com',
    'servicenetworking.googleapis.com',
    'containerregistry.googleapis.com',
    'run.googleapis.com',
    'vpcaccess.googleapis.com',
    'cloudscheduler.googleapis.com',
    'cloudresourcemanager.googleapis.com',
    'translate.googleapis.com',
    'firestore.googleapis.com',
    'cloudfunctions.googleapis.com',
    'cloudbuild.googleapis.com',
];
//# sourceMappingURL=enablePermission.js.map