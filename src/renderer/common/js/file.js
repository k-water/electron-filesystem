const fs = require('fs')
export function readFile (path) {
  console.log(path)
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      return this.$Notice.error({
        title: `${err}`,
        duration: 2
      })
    } else {
      console.log(data)
    }
  })
}
