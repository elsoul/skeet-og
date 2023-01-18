"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitignore = void 0;
const gitignore = async (appName) => {
    const filePath = `${appName}/.gitignore`;
    const body = `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/apps/*/node_modules
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo

# Gcloud key
gcloud-key.json

# env
.env

#firebase
.firebase
firebase-debug.log
firestore.json
  `;
    return {
        filePath,
        body,
    };
};
exports.gitignore = gitignore;
//# sourceMappingURL=gitignore.js.map