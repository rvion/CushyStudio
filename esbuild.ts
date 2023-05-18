import { build } from 'esbuild'

build({
    entryPoints: ['src/back/main.ts'],
    bundle: true,
    outfile: 'dist/main2.js',
    format: 'esm',
    platform: 'node',
    sourcemap: true,
    // metafile: 'dist/meta.json',
    watch: true,
    external: 
}).catch(() => process.exit(1))
