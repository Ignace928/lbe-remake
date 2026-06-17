import path from 'path'
import { app, BrowserWindow, Menu, dialog, shell } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { connection } from './lib/sequelize'
import { readSelectedDb } from './lib/selected-db'
import { initializeModels } from './lib/data-types'
import { registerIpcControllers, setGlobalSequelize } from './ipc'

const isProd = process.env.NODE_ENV === 'production'

let mainWindowRef: BrowserWindow | null = null
let isDevToolsEnabled = false

function getWindowIconPath() {
  return isProd
    ? path.join(process.resourcesPath, 'icon.ico')
    : path.join(app.getAppPath(), 'resources', 'icon.ico')
}

function setDevToolsEnabled(enabled: boolean) {
  isDevToolsEnabled = enabled

  if (!mainWindowRef || mainWindowRef.isDestroyed()) {
    return
  }

  if (enabled) {
    mainWindowRef.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindowRef.webContents.closeDevTools()
  }
}

function buildAppMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Fichier',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { type: 'separator' },
        {
          label: 'Quitter',
          click: async () => {
            const { response } = await dialog.showMessageBox({
              type: 'question',
              buttons: ['Annuler', 'Quitter'],
              defaultId: 1,
              cancelId: 0,
              title: 'Confirmation',
              message: 'Voulez-vous vraiment quitter ?',
            })

            if (response === 1) {
              app.quit()
            }
          },
        },
      ],
    },
    ...(!isProd
      ? [
          {
            label: 'Dev',
            submenu: [
              {
                label: 'Mode developpeur',
                type: 'checkbox' as const,
                checked: isDevToolsEnabled,
                click: (menuItem: Electron.MenuItem) => {
                  setDevToolsEnabled(Boolean(menuItem.checked))
                },
              },
            ],
          },
        ]
      : []),
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://www.electronjs.org/docs')
          },
        },
        {
          label: 'A propos',
          click: async () => {
            await dialog.showMessageBox({
              type: 'info',
              title: 'A propos',
              message: 'LBE-schoolar',
              detail: `Version ${app.getVersion()}\nCopyright (c) 2026 Edwardo Ignace`,
              buttons: ['OK'],
            })
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  registerIpcControllers()
  
  // Connexion à la BDD sélectionnée ou fallback sur initial.db avec synchronisation
  const selectedDb = await readSelectedDb()
  const fileName = selectedDb ? path.basename(selectedDb.path) : "initial.db"
  
  try {
    const sequelize = await connection(fileName)
    
    // Partager l'instance Sequelize avec les controllers
    setGlobalSequelize(sequelize)
    
    // Initialiser tous les modèles et associations (sans synchronisation)
    initializeModels(sequelize)
    
    // Plus de synchronisation automatique au démarrage
    console.log(`Base de données '${fileName}' connectée avec succès`)
  } catch (err) {
    throw new Error(`Erreur initialisation BDD '${fileName}': ${err.message}`)
  }

  mainWindowRef = createWindow('main', {
    width: 1000,
    height: 600,
    minWidth: 960,
    minHeight: 600,
    icon: getWindowIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  buildAppMenu()

  if (isProd) {
    await mainWindowRef.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindowRef.loadURL(`http://localhost:${port}/`)
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})
