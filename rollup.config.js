import typescript from 'rollup-plugin-typescript'
import tsc from 'typescript'

export default {
  entry: './src/typescript/index.tsx',
  dest: './static/index.js',
  format: 'iife',
  plugins: [
    typescript({ typescript: tsc })
  ],
  globals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  external: ['react', 'react-dom', 'whatwg-fetch']
}