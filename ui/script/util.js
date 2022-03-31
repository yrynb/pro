const path = require('path')
const fs = require('fs-extra')
const compressing = require('compressing')
const request = require('request')
/**
 * 在复制目录前需要判断该目录是否存在，
 * 不存在需要先创建目录
 * @param dst
 */
const exists = function (dst) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst)
  }
}
/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param dst 目标文件夹
 */
const copyDir = function (from, to, ignore) {
  if (ignore.some(k => from.includes(k))) return
  const st = fs.statSync(from)
  // 判断是否为文件
  if (st.isFile()) {
    // 创建读取流
    const f = fs.readFileSync(from)
    fs.writeFileSync(to, f)
    console.log(from, '>>>>>', to)
  } else if (st.isDirectory()) {
    // 读取目录中的所有文件/目录
    const paths = fs.readdirSync(from)
    exists(from)
    exists(to)
    paths.forEach(p => {
      copyDir(path.join(from, p), path.join(to, p), ignore)
    })
  }
}
/**
 * 压缩文件夹
 * @param {string} src 路径
 * @param {string} zipname 压缩名称
 */
const compressZip = function (src, zipname, callback) {
  return compressing.zip
    .compressDir(src, path.join(src, '..', zipname), {
      ignoreBase: true
    })
    .then(() => {
      console.log('zip success')
      callback && callback()
    })
    .catch(e => {
      console.error(e)
      callback && callback()
    })
}

const upload = function (path, url, params = {}) {
  console.info('---start upload---')
  const formData = {
    // 普通文本
    field: 'value',
    // 文件
    file: fs.createReadStream(path),
    ...params
  }

  return new Promise((resolve, rejct) => {
    request(
      {
        uri: url,
        method: 'post',
        formData: formData
      },
      function (error, response, body) {
        if (error) {
          throw new Error('upload failed: ' + error)
        } else {
          console.info('---end upload---')
          resolve()
        }
      }
    )
  })
}
module.exports = {
  exists,
  copyDir,
  compressZip,
  upload
}
