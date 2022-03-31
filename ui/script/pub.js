const fs = require('fs-extra')
const path = require('path')
const rm = require('rimraf')
const { exec } = require('child_process')
const { exists, compressZip, upload } = require('./util')
const root = path.resolve(__dirname, '..')
const pkg = require(path.join(root, 'package.json'))
const version = pkg.version
let pubPath = path.join(root, 'pub')

function then() {
  exists(pubPath)
  pubPath = path.join(pubPath, version)
  exists(pubPath)
  const date = new Date()

  fs.writeFileSync(
    path.join(pubPath, 'version.json'),
    JSON.stringify({
      version,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      author: 'zhanglin@uino.com'
    }),
    e => {
      if (e) {
        console.error(e)
      }
    }
  )
  // 打包文件
  exec('npm run build', { cwd: root }, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    fs.moveSync(
      path.join(root, 'dist/Framework.umd.js'),
      path.join(pubPath, 'framework.js')
    )
    // 打压缩包
    compressZip(path.join(pubPath, '..'), 'pub.zip', () => {
      // 上传文件
      upload(
        path.join(root, 'pub.zip'),
        'http://123.56.57.124:8181/tjsfw/frame/loadFrameZip',
        {
          type: 2
        }
      ).then((e) => {
        rm(path.join(root, 'pub.zip'), e => {
          if (e) throw e
        })
        rm(pubPath, e => {
          if (e) throw e
        })
      })
    })
  })
}
if (fs.existsSync(pubPath)) {
  rm(pubPath, e => {
    if (e) throw e
    then()
  })
} else {
  then()
}
