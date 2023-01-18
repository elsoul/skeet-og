"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettierrc = void 0;
const prettierrc = async (appName) => {
    const filePath = `${appName}/.prettierrc`;
    const body = {
        semi: false,
        singleQuote: true,
    };
    return {
        filePath,
        body,
    };
};
exports.prettierrc = prettierrc;
//# sourceMappingURL=prettierrc.js.map