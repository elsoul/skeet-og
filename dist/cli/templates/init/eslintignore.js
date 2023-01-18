"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eslintignore = void 0;
const eslintignore = async (appName) => {
    const filePath = `${appName}/.eslintignore`;
    const body = `
.next
out
dist
build
src/__generated__
src / schema.graphql
  `;
    return {
        filePath,
        body,
    };
};
exports.eslintignore = eslintignore;
//# sourceMappingURL=eslintignore.js.map