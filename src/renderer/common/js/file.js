import { icon } from '@/common/js/icon'
import { exec } from 'child_process'
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
      if (result.length > 30) {
        return result.slice(0, 30)
      } else {
        return result
      }
    }).catch(err => {
      console.log(err)
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
    console.log(`dist is: ${dist}`)
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
