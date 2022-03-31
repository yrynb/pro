import minize from 'rollup-plugin-minize'
import mergeConfig from './baseConfig'

const path = require('path')
const pathResolve = p => path.resolve(__dirname, '../', p)

const compileList = [
  {
    fileName: 'UI',
    aliasName: 'UI'
  },
]

const config = aliasName => ({
  env: 'production',
  output: [
    {
      file: pathResolve(`dist/${aliasName}.umd.js`),
      format: `umd`
    },
    {
      file: pathResolve(`dist/${aliasName}.esm.js`),
      format: `esm`
    }
  ],
  plugins: [minize()]
})

module.exports = mergeConfig(compileList, config)
