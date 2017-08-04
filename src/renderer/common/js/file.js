import { icon } from '@/common/js/icon'

const fs = require('fs')
// const path = require('path')

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
