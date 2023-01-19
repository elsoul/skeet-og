"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettierignore = void 0;
const prettierignore = async (appName) => {
    const filePath = `${appName}/.prettierignore`;
    const body = `
.next
out
dist
build
src/__generated__
src/schema.graphql
  `;
    return {
        filePath,
        body,
    };
};
exports.prettierignore = prettierignore;
//# sourceMappingURL=prettierignore.js.map