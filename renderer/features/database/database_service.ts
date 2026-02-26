import {
  DatabaseStatusResponse,
  DatabaseReconnectResponse,
  DatabaseCreateResponse,
  DatabaseListResponse,
  DatabaseDeleteResponse,
  DatabaseSyncResponse,
  SelectedDatabase,
  DatabaseFile
} from './database_types'

// Service pour les opérations de base de données
export const databaseService = {
  // Obtenir le statut de la base de données
  async getStatus(): Promise<DatabaseStatusResponse> {
    const result = await window.ipc.database.getStatus()
    console.log('DatabaseService - getStatus result:', result)
    return result
  },

  // Reconnecter à une nouvelle base de données
  async reconnect(fileName: string): Promise<DatabaseReconnectResponse> {
    const result = await window.ipc.database.reconnect(fileName)
    console.log('DatabaseService - reconnect result:', result)
    return result
  },

  // Créer une nouvelle base de données
  async create(fileName: string): Promise<DatabaseCreateResponse> {
    const result = await window.ipc.file.createDataBase(fileName)
    console.log('DatabaseService - create result:', result)
    return {
      success: true,
      message: 'Base de données créée avec succès',
      data: result
    }
  },

  // Lister les bases de données
  async list(): Promise<DatabaseListResponse> {
    const result = await window.ipc.file.listDataBase()
    console.log('DatabaseService - list result:', result)
    return {
      success: true,
      message: 'Liste récupérée avec succès',
      data: result
    }
  },

  // Supprimer une base de données
  async delete(filePath: string): Promise<DatabaseDeleteResponse> {
    const result = await window.ipc.file.dropDataBase(filePath)
    console.log('DatabaseService - delete result:', result)
    return result
  },

  // Synchroniser la base de données
  async sync(): Promise<DatabaseSyncResponse> {
    const result = await window.ipc.file.syncDatabase()
    console.log('DatabaseService - sync result:', result)
    return result
  },

  // Obtenir la base de données sélectionnée
  async getSelected(): Promise<SelectedDatabase | null> {
    const result = await window.ipc.file.getSelectedDB()
    console.log('DatabaseService - getSelected result:', result)
    return result
  },

  // Définir la base de données sélectionnée
  async setSelected(db: DatabaseFile): Promise<SelectedDatabase> {
    const result = await window.ipc.file.setSelectedDB(db)
    console.log('DatabaseService - setSelected result:', result)
    return result
  },

  // Effacer la sélection
  async clearSelected(): Promise<void> {
    const result = await window.ipc.file.clearSelectedDB()
    console.log('DatabaseService - clearSelected result:', result)
    return result
  }
}

// Fonctions legacy pour compatibilité
export const fetchDatabaseStatus = databaseService.getStatus
export const reconnectDatabase = databaseService.reconnect
