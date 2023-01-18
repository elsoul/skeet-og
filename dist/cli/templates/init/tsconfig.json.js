"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsconfigJson = void 0;
const tsconfigJson = async (appName) => {
    const filePath = `${appName}/tsconfig.json`;
    const body = {
        compilerOptions: {
            target: 'ESNext',
            module: 'CommonJS',
            outDir: './dist',
            rootDir: './src',
            strict: true,
            moduleResolution: 'node',
            baseUrl: 'src',
            esModuleInterop: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            resolveJsonModule: true,
            lib: ['esnext'],
            sourceMap: true,
            allowJs: true,
            paths: {
                '@/*': ['src/*'],
            },
        },
        include: ['src/**/*'],
        exclude: ['dist', 'node_modules'],
        compileOnSave: false,
    };
    return {
        filePath,
        body,
    };
};
exports.tsconfigJson = tsconfigJson;
//# sourceMappingURL=tsconfig.json.js.map