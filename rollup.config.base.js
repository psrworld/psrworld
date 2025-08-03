import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export function createConfig(format, outputFile) {
  return {
    input: 'src/index.ts',
    output: {
      file: outputFile,
      format: format,
      sourcemap: false,
      exports: format === 'cjs' ? 'named' : 'auto',
    },
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // We handle declarations separately
        declarationMap: false,
        sourceMap: false,
      }),
    ],
    external: [
      // Add external dependencies here that should not be bundled
      // Example: 'lodash', 'react', etc.
    ],
  };
}