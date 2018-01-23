import {
  icon
} from '@/common/js/icon'
import {
  exec
} from 'child_process'
import iconv from 'iconv-lite'
import Vue from 'vue'
const fs = require('fs')

/**
 * @export
 * @param {String} path
 * @returns
 * @feature 读取文件内容
 */
export function readFolder (path) {
  return getFolder(path).then(filenames => {
    let result = []
    let promise = filenames.map(filename => {
      return getFileInfo(path + filename).then(stats => {
        result.push(stats)
      }).catch(err => {
        console.log(err)
      })
    })
    return Promise.all(promise).then(() => {
      console.log(result)
      return result
    }).catch(err => {
      return console.log(err)
    })
  })
}
/**
 * @export
 * @param {String} path
 * @feature 打开文件
 */
export function openFile (path) {
  exec(`${path}`, function (error, stdout, stderr) {
    if (error !== null) {
      Vue.prototype.$Notice.error({
        title: '暂不支持打开该文件',
        duration: 2
      })
    }
  })
}

/**
 * @export
 * @param {String} src
 * @returns
 * @feature 读取文件夹信息
 */
export function getFolder (src) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

/**
 * @export
 * @param {String} src
 * @returns
 * @feature 读取文件信息
 */
export function getFileInfo (src) {
  return new Promise((resolve, reject) => {
    fs.stat(src, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        let temp = src.split('\\\\')
        let type = 'unknown'
        let seq = temp[temp.length - 1].split('.')

        // 类型
        let mime = seq[seq.length - 1]
        // 文件名
        stats.name = temp[temp.length - 1]
        if (stats.isDirectory()) {
          type = 'folder'
        } else if (icon.hasOwnProperty(mime.toLowerCase())) {
          type = mime.toLowerCase()
        }

        stats.type = icon[type].type
        stats.src = icon[type].src
        stats.path = src
        stats.rename = false
        stats.location = stats.path.slice(0, stats.path.indexOf(stats.name))
        resolve(stats)
      }
    })
  })
}

/**
 * @param {Number} start
 * @param {Number} count
 * @returns
 * @feature 生成可遍历的连续数字
 */
function range (start, count) {
  return Array.apply(0, Array(count))
    .map((element, index) => {
      return index + start
    })
}

/**
 * @export
 * @param {String} to 目的路径
 * @returns
 * @feature 生成一个目录副本路径
 */
export function duplicateFolder (to) {
  if (!fs.existsSync(to)) {
    return to
  }
  for (let i of range(1, 100)) {
    if (!fs.existsSync(to + '[' + i + ']')) {
      return to + '[' + i + ']'
    }
  }
}

/**
 * @export
 * @param {String} src
 * @returns
 * @feature 新建文件夹
 */

export function createNewFolder (src) {
  return new Promise((resolve, reject) => {
    let dist = duplicateFolder(src + '新建文件夹')
    fs.mkdir(dist, 777, err => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(getFileInfo(dist))
      }
    })
  })
}
/**
 * @param {String} to 目的路径
 * @returns
 * @feature 生成一个文件副本路径
 */
function duplicate (to) {
  if (!fs.existsSync(to)) {
    return to
  }
  let dist = to.split('.')
  let origin = dist[dist.length - 2]
  for (let i of range(1, 100)) {
    dist[dist.length - 2] = origin
    dist[dist.length - 2] += '[' + i + ']'
    let checkDist = dist.join('.')
    if (!fs.existsSync(checkDist)) {
      return checkDist
    }
  }
}

/**
 * @export
 * @param {String} src
 * @returns
 * @feature 新建文本文档
 */
export function createNewTxt (src) {
  return new Promise((resolve, reject) => {
    let dist = duplicate(src + '新文档.txt')
    fs.appendFile(dist, '', err => {
      if (err) {
        alert(err)
        reject(err)
      } else {
        resolve(getFileInfo(dist))
      }
    })
  })
}
/**
 * @export
 * @param {String} src 路径
 * @param {Objec} dialog electron
 * @param {Boolean} alert
 * @returns
 * @feature 删除文件
 */
export function deleteFile (src, dialog, alert) {
  let buttons = ['OK', 'Cancel']
  let title = '删除文件'
  let infoSuccess = '删除 ' + src + ' 成功!'
  let message = '确认要删除吗? 此操作不可逆!'
  return new Promise((resolve, reject) => {
    if (alert !== false) {
      dialog.showMessageBox({
        type: 'question',
        title: title,
        buttons: buttons,
        message: message
      }, index => {
        if (index === 0) {
          fs.unlink(src, err => {
            if (err) {
              reject(err)
            } else {
              dialog.showMessageBox({
                title: infoSuccess,
                detail: infoSuccess,
                type: 'info',
                buttons: ['OK']
              })
              resolve()
            }
          })
        } else {
          const err = 'cancel'
          reject(err)
        }
      })
    } else {
      fs.unlink(src, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }
  })
}
/**
 * @export
 * @param {String} src
 * @param {Object} dialog
 * @param {Boolean} alert
 * @returns
 * @feature 删除文件夹
 */
export function deleteFolder (src, dialog, alert) {
  let buttons = ['OK', 'Cancel']
  let title = '删除文件夹'
  let infoSuccess = '删除 ' + src + ' 成功!'
  let message = '确认要删除吗? 此操作不可逆!'
  return new Promise((resolve, reject) => {
    if (alert !== false) {
      dialog.showMessageBox({
        type: 'question',
        title: title,
        buttons: buttons,
        message: message
      }, index => {
        if (index === 0) {
          exec(`rmdir "${src}" /S /Q`, {
            encoding: 'GB2312'
          }, (err, stdout, stderr) => {
            if (err || iconv.decode(stderr, 'GB2312')) {
              dialog.showErrorBox(iconv.decode(stderr, 'GB2312'), iconv.decode(stdout, 'GB2312'))
              reject(iconv.decode(stderr, 'GB2312'))
            } else {
              dialog.showMessageBox({
                title: infoSuccess,
                detail: infoSuccess,
                type: 'info',
                buttons: ['OK']
              })
              resolve()
            }
          })
        }
      })
    } else {
      exec(`rmdir "${src}" /S /Q`, {
        encoding: 'GB2312'
      }, (err, stdout, stderr) => {
        if (err || iconv.decode(stderr, 'GB2312')) {
          dialog.showErrorBox(iconv.decode(stderr, 'GB2312'), iconv.decode(stdout, 'GB2312'))
          reject(iconv.decode(stderr, 'GB2312'))
        } else {
          resolve()
        }
      })
    }
  })
}
/**
 * @export
 * @param {String} src
 * @param {String} dist
 * @returns
 * @feature 重命名
 */
export function rename (src, dist) {
  return new Promise((resolve, reject) => {
    fs.rename(src, dist, err => {
      if (err) {
        reject(err)
      } else {
        return getFileInfo(dist).then(stat => {
          resolve(stat)
        })
      }
    })
  })
}

/**
 * @param {String} src
 * @param {String} dist
 * @param {Object} dialog
 * @returns
 * @feature 拷贝文件
 */
function copy (src, dist, dialog) {
  return new Promise((resolve, reject) => {
    exec(`copy "${src}" "${dist}" /Y`, {
      encoding: 'GB2312'
    }, (err, stdout, stderr) => {
      if (err || iconv.decode(stderr, 'GB2312')) {
        dialog.showErrorBox(iconv.decode(stderr, 'GB2312'), iconv.decode(stdout, 'GB2312'))
        reject(iconv.decode(stderr, 'GB2312'))
      } else {
        dialog.showMessageBox({
          type: 'info',
          title: 'Success',
          message: iconv.decode(stdout, 'GB2312'),
          buttons: ['OK']
        })
        getFileInfo(dist).then(stat => {
          resolve(stat)
        })
      }
    })
  })
}
/**
 * @export
 * @param {String} src
 * @param {String} dist
 * @param {Object} dialog
 * @returns
 * @feature 粘贴文件
 */
export function copyFile (src, dist, dialog) {
  return new Promise((resolve, reject) => {
    if (src === dist) {
      copy(src, duplicate(dist), dialog).then(result => {
        resolve(result)
      }, err => {
        reject(err)
      })
    } else {
      if (fs.existsSync(dist)) {
        let title = '重名文件存在'
        let message = '重名文件存在，继续粘贴将覆盖，是否继续?'
        const buttons = ['OK', 'Cancel']
        dialog.showMessageBox({
          type: 'question',
          title: title,
          buttons: buttons,
          message: message
        }, index => {
          if (index === 0) {
            copy(src, dist, dialog).then(result => {
              resolve(result)
            }, err => {
              reject(err)
            })
          }
        })
      } else {
        copy(src, dist, dialog).then(result => {
          resolve(result)
        }, err => {
          reject(err)
        })
      }
    }
  })
}

function xcopy (src, dist, dialog) {
  return new Promise((resolve, reject) => {
    exec(`xcopy "${src}" "${dist}" /E /C /Y /H /I`, {
      encoding: 'GB2312'
    }, (err, stdout, stderr) => {
      if (err || iconv.decode(stderr, 'GB2312')) {
        dialog.showErrorBox(iconv.decode(stderr, 'GB2312'), iconv.decode(stdout, 'GB2312'))
        reject(iconv.decode(stderr, 'GB2312'))
      } else {
        dialog.showMessageBox({
          type: 'info',
          title: 'Success',
          message: iconv.decode(stdout, 'GB2312'),
          buttons: ['OK']
        })
        getFileInfo(dist).then(stat => {
          resolve(stat)
        })
      }
    })
  })
}

export function copyFolder (src, dist, dialog) {
  return new Promise((resolve, reject) => {
    if (src === dist) {
      xcopy(src, duplicateFolder(dist), dialog).then(result => {
        resolve(result)
      }, err => {
        reject(err)
      })
    } else {
      if (fs.existsSync(dist)) {
        let title = '重名文件夹存在'
        let message = '重名文件夹存在，继续粘贴将覆盖，是否继续?'
        const buttons = ['OK', 'Cancel']
        dialog.showMessageBox({
          type: 'question',
          title: title,
          buttons: buttons,
          message: message
        }, index => {
          if (index === 0) {
            xcopy(src, dist, dialog).then(result => {
              resolve(result)
            }, err => {
              reject(err)
            })
          } else {
            resolve()
          }
        })
      } else {
        xcopy(src, dist, dialog).then(result => {
          resolve(result)
        }, err => {
          reject(err)
        })
      }
    }
  })
}
