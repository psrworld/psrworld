import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/cli/index.ts',
  output: {
    file: 'bin/create-psrworld.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    sourcemap: false,
  },
  plugins: [
    json(),
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      sourceMap: false,
    }),
  ],
  external: [
    // Keep these as external dependencies
    'cross-spawn',
    'mri', 
    '@clack/prompts',
    'picocolors'
  ],
};