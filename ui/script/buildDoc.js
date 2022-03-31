const fs = require('fs')
const path = require('path')
const join = path.join
const jsdoc2md = require('jsdoc-to-markdown')
const compsPath = join(__dirname, '../src')
const distPath = join(__dirname, '../dist')
const apiFileName = 'API.md'

// 不展示的接口的js文件列表
const filterFiles = []
const getJsFiles = jsPath => {
  let jsFiles = []
  const findJsFile = path => {
    let files = fs.readdirSync(path)
    
    files.forEach(item => {
      if(filterFiles && filterFiles.length && item.endsWith('.js') && filterFiles.includes(item.replace('.js', ''))) {
        return
      }
      const fPath = join(path, item)
      const stat = fs.statSync(fPath)
      if (fs.statSync(fPath).isDirectory() === true) findJsFile(fPath)
      if (stat.isFile() === true && item.endsWith('.js')) jsFiles.push(fPath)
    })
  }
  findJsFile(jsPath)
  return jsFiles
}
// 生成的md路径
const docs = jsdoc2md.renderSync({
  files: getJsFiles(compsPath),
  'name-format': '``',
  'no-gfm': false
})

const apiPath = join(distPath, apiFileName)
isFileExisted(apiPath)
fs.writeFileSync(apiPath, docs, err => err && console.error(err))

/* 检测文件是否存在
 * - 不存在就创建
 * @param {path} path, 文件路径
 */
function isFileExisted(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, err => {
      if (err) {
        fs.appendFileSync(path, '', 'utf-8', err => {
          if (err) {
            return console.warn('该文件不存在，重新创建失败！')
          }
          console.warn('文件不存在，已新创建')
        })
        // reject(false)
      } else {
        resolve(true)
      }
    })
  })
}
