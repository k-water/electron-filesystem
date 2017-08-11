var grunt = require('grunt')
grunt
  .config
  .init({
    pkg: grunt
      .file
      .readJSON('package.json'),
    'create-windows-installer': {
      x64: {
        appDirectory: './fileSystem-win32-x64',
        authors: 'water',
        exe: 'fileSystem.exe',
        description: 'fileSystem'
      }
    }
  })

grunt.loadNpmTasks('grunt-electron-installer')
grunt.registerTask('default', ['create-windows-installer'])
