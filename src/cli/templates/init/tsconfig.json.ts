export const tsconfigJson = async (appName: string) => {
  const filePath = `${appName}/tsconfig.json`
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
  }
  return {
    filePath,
    body,
  }
}
