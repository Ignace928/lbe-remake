import { ipcMain } from 'electron'
import { IPC_CHANNELS } from './channels'
import { getGlobalSequelize, reconnectDatabase } from './database'

export function registerDatabaseController() {
  // Vérifier l'état de la base de données
  ipcMain.removeHandler(IPC_CHANNELS.databaseStatus)
  ipcMain.handle(IPC_CHANNELS.databaseStatus, async () => {
    try {
      const sequelize = getGlobalSequelize()
      
      if (!sequelize) {
        return {
          success: false,
          initialized: false,
          message: 'Base de données non initialisée - aucune connexion Sequelize'
        }
      }

      // Vérifier si les tables existent en testant une requête simple
      try {
        // Importer le modèle User pour tester une requête
        const { User } = require('../lib/data-types')
        
        // Tenter une requête simple sur la table USERS
        const userCount = await User.count()
        
        // Si on peut compter les utilisateurs, la table existe
        if (userCount >= 0) {
          return {
            success: true,
            initialized: true,
            message: `Base de données initialisée avec ${userCount} utilisateur(s)`
          }
        }
        
        return {
          success: false,
          initialized: false,
          message: 'Base de données connectée mais non synchronisée - aucune table trouvée'
        }
      } catch (tableError) {
        return {
          success: false,
          initialized: false,
          message: `Erreur lors de la vérification des tables: ${tableError.message}`
        }
      }
    } catch (error) {
      return {
        success: false,
        initialized: false,
        message: `Erreur lors de la vérification de la base de données: ${error.message}`
      }
    }
  })

  // Reconnecter à une nouvelle base de données
  ipcMain.removeHandler(IPC_CHANNELS.dbReconnect)
  ipcMain.handle(IPC_CHANNELS.dbReconnect, async (_, fileName: string) => {
    return await reconnectDatabase(fileName)
  })
}
