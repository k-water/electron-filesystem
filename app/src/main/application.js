import { app, BrowserWindow } from 'electron'
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
  }

  run () {
    this.registerApplicationCallback()
  }
}
