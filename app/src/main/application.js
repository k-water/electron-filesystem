import { app, BrowserWindow } from 'electron'
import path from 'path'
export default class Application {
  constructor () {
    this.winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:${require('../../../config').port}`
      : `file://${__dirname}/index.html`
    this.mainWindow = undefined
  }

  createWindow () {
    this.mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080
    })

    this.mainWindow.loadURL(this.winURL)

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  onReady () {
    this.createWindow()
  }

  registerApplicationCallback () {
    app.on('ready', this.onReady.bind(this))

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createWindow()
      }
    })

    var handleStartupEvent = function () {
      if (process.platform !== 'win32') {
        return false
      }

      var squirrelCommand = process.argv[1]

      switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
          install()
          return true
        case '--squirrel-uninstall':
          uninstall()
          app.quit()
          return true
        case '--squirrel-obsolete':
          app.quit()
          return true
      }

      function install () {
        var cp = require('child_process')
        var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
        var target = path.basename(process.execPath)
        var child = cp.spawn(updateDotExe, [
          '--createShortcut', target
        ], {detached: true})
        child.on('close', function (code) {
          app.quit()
        })
      }
      function uninstall () {
        var cp = require('child_process')
        var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
        var target = path.basename(process.execPath)
        var child = cp.spawn(updateDotExe, [
          '--removeShortcut', target
        ], {detached: true})
        child.on('close', function (code) {
          app.quit()
        })
      }
    }

    if (handleStartupEvent()) {
      return
    }
  }

  run () {
    this.registerApplicationCallback()
  }
}
