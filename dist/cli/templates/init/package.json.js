"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageJson = void 0;
const packageJson = async (appName) => {
    const filePath = `${appName}/package.json`;
    const body = {
        name: appName,
        version: '0.0.1',
        description: 'Skeet Full-stack TypeScript Serverless Framework',
        main: 'dist/index.js',
        repository: 'https://github.com/elsoul/skeet.git',
        author: 'ELSOUL LABO B.V.',
        license: 'Apache-2.0',
        private: true,
        scripts: {
            dev: 'yarn --cwd ./apps/api dev',
        },
    };
    return {
        filePath,
        body,
    };
};
exports.packageJson = packageJson;
//# sourceMappingURL=package.json.js.map