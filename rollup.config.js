import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/analytics.js',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    nodeResolve()
  ]
};