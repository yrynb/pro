import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import lint from 'rollup-plugin-lintes'
import worker from 'rollup-plugin-worker'

const path = require('path')
const pathResolve = p => path.resolve(__dirname, '../', p)
let isDev = null

const baseFn = (fileName, aliasName) => ({
  input: `src/${fileName}.js`,
  output: {
    file: pathResolve(`dist/${aliasName}.js`),
    name: aliasName,
    exports: 'default'
  },
  plugins: [
    resolve(),
    lint(),
    commonjs(),
    worker({
      uglify: !!isDev,
      plugins: [lint()]
    })
  ]
})

const baseConfig = (fileName, aliasName, importFn) => {
  const _importConfig = importFn(aliasName)
  isDev = _importConfig.env === 'development'
  const _baseConfig = baseFn(fileName, aliasName)

  return {
    input: `src/${fileName}.js`,
    output: Array.isArray(_importConfig.output)
      ? _importConfig.output.map(i => {
          return {
            ..._baseConfig.output,
            ...i
          }
        })
      : {
          ..._baseConfig.output,
          ..._importConfig.output
        },
    plugins: [..._baseConfig.plugins, ..._importConfig.plugins]
  }
}

const mergeConfig = (compileList, config) => {
  return compileList.map(({ fileName, aliasName }) => {
    return baseConfig(fileName, aliasName, config)
  })
}

export default mergeConfig
