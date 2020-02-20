import { app, BrowserWindow, Menu, shell, Tray, nativeImage, dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import giterMenu from './electron-menu'
import { githubOauth } from '../../src/services/auth'
const AutoLaunch = require('auto-launch')
const unhandled = require('electron-unhandled')
const { openNewGitHubIssue, debugInfo } = require('electron-util')
const path = require('path')
const log = require('electron-log')

unhandled({
  reportButton: error => {
    openNewGitHubIssue({
      user: '4ban',
      repo: 'git8',
      body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
    })
  }
})

const autoStart = new AutoLaunch({
  name: 'GIT8',
  path: process.execPath.match(/.*?\.app/)[0],
  isHidden: true
})

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    minWidth: 600,
    minHeight: 500,
    frame: false,
    show: false,
    resizable: false,
    title: 'git8',
    fullscreenable: false,
    // useContentSize: true,
    webPreferences: {
      backgroundThrottling: false,
      overlayScrollbars: true,
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // appWindow.on('close', function (event) {
  //   if (!isQuitting) {
  //     event.preventDefault();
  //     appWindow.hide();
  //   }
  // });

  const appMenu = giterMenu(app, shell, mainWindow)
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu))
}

// if (!app.requestSingleInstanceLock()) {
//   app.quit()
// }

// app.on('second-instance', () => {
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) {
//       mainWindow.restore()
//     }
//     mainWindow.show()
//   }
// })

// Tray
let iconPath
if (process.env.PROD) {
  iconPath = path.join(__dirname, 'statics/tray')
} else {
  iconPath = path.join('src/statics/tray')
}

// TODO add update icons
const iconIdle = process.platform === 'win32' ? '/trayTemplateWindows.png' : '/trayTemplate.png'
const iconActive = process.platform === 'win32' ? '/trayActiveWindows.png' : '/trayActive.png'

let tray = null
app.on('ready', () => {
  tray = new Tray(nativeImage.createFromPath(iconPath + iconIdle))
  const contextMenu = Menu.buildFromTemplate([
    { label: app.name + ': ' + app.getVersion(), enabled: false },
    { type: 'separator' },
    {
      label: 'Check for updates',
      enabled: true,
      click: () => {
        autoUpdater.checkForUpdatesAndNotify()
      }
    },
    {
      label: 'Preferences',
      accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
      enabled: true,
      click: () => {
        mainWindow.webContents.send('toggle-settings')
      }
    },
    { type: 'separator' },
    {
      label: 'Report an issue',
      click: () => {
        const body = `<!-- Please succinctly describe your issue and steps to reproduce it. --> --- ${debugInfo()}`
        openNewGitHubIssue({
          user: '4ban',
          repo: 'git8',
          body
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy()
        app.quit()
      }
    }
  ])

  tray.setToolTip(app.name)
  // tray.setContextMenu(contextMenu)
  // tray.on('double-click', toggleWindow)
  tray.on('click', (event, bounds) => {
    const { x, y } = bounds
    const { height, width } = mainWindow.getBounds()
    toggleWindow(x, y, height, width)
    // Show devtools when command clicked
    // if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
    //   mainWindow.openDevTools({
    //     mode: 'detach'
    //   })
    // }
  })
  tray.on('right-click', event => {
    tray.popUpContextMenu(contextMenu)
  })
})

app.on('ready', () => {
  if (process.platform === 'win32') {
    // TODO Fix the Model ID
    app.setAppUserModelId('io.git8.git8')
  }
})

const toggleWindow = (x, y, height, width) => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    const yPosition = process.platform === 'darwin' ? y : y - height
    mainWindow.setBounds({
      x: x - width / 2,
      y: yPosition,
      height,
      width
    })
    mainWindow.setVisibleOnAllWorkspaces(true)
    mainWindow.show()
    mainWindow.setVisibleOnAllWorkspaces(false)
    // mainWindow.show()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Hide on focus lost
app.on('browser-window-blur', (event, win) => {
  mainWindow.hide()
})

ipcMain.on('showWindow', () => mainWindow.show())
ipcMain.on('open-settings', () => {
  mainWindow.webContents.send('toggle-settings')
})

// TODO Finish the autostart feature
// ipcMain.on('startup-enable', () => autoStart.enable())
// ipcMain.on('startup-disable', () => autoStart.disable())

ipcMain.on('set-badge', (event, count) => {
  app.badgeCount = count
})
ipcMain.on('update-icon', (event, arg) => {
  if (!tray.isDestroyed()) {
    if (arg === 'TrayActive') {
      tray.setImage(nativeImage.createFromPath(iconPath + iconActive))
    } else {
      tray.setImage(nativeImage.createFromPath(iconPath + iconIdle))
    }
  }
})

ipcMain.on('autoStart-enable', () => autoStart.enable())
ipcMain.on('autoStart-disable', () => autoStart.disable())
// Auth
const authWindowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  useContentSize: true,
  webPreferences: {
    nodeIntegration: false
  }
}
const oauthConfig = require('../../src/config').oauth
const auth = githubOauth(oauthConfig, authWindowParams)
ipcMain.on('github-oauth', (event) => {
  auth.getAccessToken({}).then(token => {
    mainWindow.send('auth-success', token)
  },
  err => {
    // TODO add app notification
    console.log('Error while getting token', err)
  })
})

// TODO Finish the autoupdater
// Autoupdater
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function sendStatusToWindow (type = 'message', text) {
  log.info(text)
  mainWindow.webContents.send(type, text)
}

function confirmAutoUpdate (updater) {
  dialog.showMessageBox(
    {
      type: 'question',
      buttons: ['Update & Restart', 'Cancel'],
      title: 'Update Available',
      message: 'There is an update available. Would you like to update the GIT8 now?',
      detail: 'Please restart the application to apply the updates.'
    },
    response => {
      if (response === 0) {
        // TODO check which method works better
        updater.quitAndInstall()
        // updater.install()
      }
    }
  )
}

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...')
// })

// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.')
// })

autoUpdater.on('update-available', info => {
  sendStatusToWindow('notification', 'Update available.')
  try {
    app.dock.setBadge('update')
  } catch (e) {
    log.info('setBadge() does not work on windows.')
  }
  try {
    tray.setImage(
      nativeImage.createFromPath(iconPath + '/trayUpdateTemplate.png')
    )
  } catch (e) {
    log.info('setImage() does not work on windows')
  }
})

autoUpdater.on('error', (event, error) => {
  sendStatusToWindow('error', 'Event: ' + JSON.stringify(event) + '. Error: ' + error)
})

autoUpdater.on('download-progress', obj => {
  sendStatusToWindow('message', obj.percent)
})

autoUpdater.on('update-downloaded', function (event) {
  confirmAutoUpdate(autoUpdater)
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    log.info('Setup check for updates and notify')
    autoUpdater.checkForUpdatesAndNotify()
  }
})
