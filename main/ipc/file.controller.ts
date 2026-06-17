import { app, ipcMain } from 'electron'
import { mkdir, readdir, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { IPC_CHANNELS } from './channels'
import { readSelectedDb, writeSelectedDb, clearSelectedDb } from '../lib/selected-db'
import { connection, synchronize } from '../lib/sequelize'
import { initializeModels, User } from '../lib/data-types'
import { setGlobalSequelize } from './database'

function sanitizeFileName(rawFileName: string) {
  const trimmed = rawFileName.trim()
  const baseName = trimmed.replace(/\.db$/i, '')
  const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')

  if (!safeName) {
    throw new Error('Invalid file name')
  }

  return `${safeName}.db`
}

export function registerFileController() {
  ipcMain.removeHandler(IPC_CHANNELS.fileCreateDB)
  ipcMain.handle(IPC_CHANNELS.fileCreateDB, async (_event, fileName: string) => {
    const safeFileName = sanitizeFileName(fileName)
    const dataDir = path.join(app.getPath('userData'), 'data')
    const filePath = path.join(dataDir, safeFileName)

    await mkdir(dataDir, { recursive: true })
    await writeFile(filePath, '', 'utf8')

    return filePath
  })


  ipcMain.removeHandler(IPC_CHANNELS.fileListDB)
  ipcMain.handle(IPC_CHANNELS.fileListDB, async () => {
    const dataDir = path.join(app.getPath('userData'), 'data')
    await mkdir(dataDir, { recursive: true })

    const entries = await readdir(dataDir, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.db'))
      .map((e) => ({
        name: e.name,
        path: path.join(dataDir, e.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })


  ipcMain.removeHandler(IPC_CHANNELS.fileDeleteDB)
  ipcMain.handle(IPC_CHANNELS.fileDeleteDB, async (_event, file_path: string) => {
    try {
      await unlink(file_path);
      return {success:'suprimé avec succes', error:''}
    } catch (err) {
      return {success:'', error:err.message}
    }
  })

  ipcMain.removeHandler(IPC_CHANNELS.fileGetSelectedDB)
  ipcMain.handle(IPC_CHANNELS.fileGetSelectedDB, async () => {
    return await readSelectedDb()
  })

  ipcMain.removeHandler(IPC_CHANNELS.fileSetSelectedDB)
  ipcMain.handle(IPC_CHANNELS.fileSetSelectedDB, async (_event, { name, path }) => {
    return await writeSelectedDb({ name, path })
  })

  ipcMain.removeHandler(IPC_CHANNELS.fileClearSelectedDB)
  ipcMain.handle(IPC_CHANNELS.fileClearSelectedDB, async () => {
    return await clearSelectedDb()
  })

  ipcMain.removeHandler(IPC_CHANNELS.dbSync)
  ipcMain.handle(IPC_CHANNELS.dbSync, async () => {
    try {
      // Récupérer la BDD sélectionnée
      const selectedDb = await readSelectedDb()
      const fileName = selectedDb ? path.basename(selectedDb.path) : "initial.db"
      
      // Connexion et synchronisation
      const sequelize = await connection(fileName)
      initializeModels(sequelize)
      const syncResult = await synchronize(sequelize, { alter: true })
      
      // Stocker l'instance Sequelize globalement pour le contrôleur de base de données
      setGlobalSequelize(sequelize)
      
      // Créer l'utilisateur par défaut "Necro" si la synchronisation a réussi
      if (syncResult.success) {
        try {
          // Vérifier si l'utilisateur "Necro" existe déjà
          const existingUser = await User.findOne({ 
            where: { nom_user: 'Necro' } 
          })
          
          if (!existingUser) {
            // Créer l'utilisateur par défaut
            await User.create({
              nom_user: 'Necro',
              mdp: Buffer.from('').toString('base64'), // Mot de passe vide encodé en base64
              role: 'admin'
            })
            // Utilisateur par défaut "Necro" créé avec succès
          } else {
            // L'utilisateur "Necro" existe déjà
          }
        } catch (userError) {
          console.error('Erreur lors de la création de l\'utilisateur par défaut:', userError)
          // Ne pas échouer la synchronisation si la création de l'utilisateur échoue
        }
      }
      
      return {
        success: syncResult.success,
        message: syncResult.success 
          ? `${syncResult.message}. Utilisateur par défaut "Necro" créé.` 
          : syncResult.message,
        database: fileName
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        database: null
      }
    }
  })
}

