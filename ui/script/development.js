import reload from 'rollup-plugin-reload'
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
  env: 'development',
  output: {
    file: pathResolve(`example/${aliasName}-dev.js`),
    sourcemap: true,
    format: `umd`
  },
  plugins: [
    reload({
      contentBase: pathResolve('example'),
      port: 8000
    })
  ]
})

module.exports = mergeConfig(compileList, config)
