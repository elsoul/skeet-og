"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eslintrcJson = void 0;
const eslintrcJson = async (appName) => {
    const filePath = `${appName}/.eslintrc.json`;
    const body = {
        extends: ['prettier'],
    };
    return {
        filePath,
        body,
    };
};
exports.eslintrcJson = eslintrcJson;
//# sourceMappingURL=eslintrc.json.js.map