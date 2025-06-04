import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const __ENV__ = process.env.NODE_ENV ?? 'development';

export default (args) => {
    return {
        input: 'src/main.js',

        output: {
            file: 'dist/main.js',
            format: 'esm',
            sourcemap: true,
        },

        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(__ENV__),
                preventAssignment: true,
            }),
            commonjs(),
            nodeResolve(),
            typescript(),
            lwc(),
            args.watch &&
                serve({
                    open: false,
                    port: 3000,
                }),
            args.watch && livereload(),
        ],
    };
};
