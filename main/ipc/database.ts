<<<<<<< HEAD
import { Sequelize } from "sequelize";

// Instance Sequelize globale partagée entre tous les controllers
let globalSequelize: Sequelize = null

export function setGlobalSequelize(sequelize: Sequelize) {
=======
// Instance Sequelize globale partagée entre tous les controllers
let globalSequelize: any = null

export function setGlobalSequelize(sequelize: any) {
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  globalSequelize = sequelize
}

export function getGlobalSequelize() {
  return globalSequelize
}

export async function reconnectDatabase(newFileName: string): Promise<{ success: boolean; message: string }> {
  try {
    // Fermer l'ancienne connexion si elle existe
    if (globalSequelize) {
      await globalSequelize.close()
      // console.log('Ancienne connexion Sequelize fermée')
    }

    // Importer la fonction de connexion
    const { connection } = require('../lib/sequelize')
    
    // Créer la nouvelle connexion
    const newSequelize = await connection(newFileName)
    
    // Initialiser les modèles avec la nouvelle connexion
    const { initializeModels } = require('../lib/data-types')
    initializeModels(newSequelize)
    
    // Mettre à jour l'instance globale
    setGlobalSequelize(newSequelize)
    
    console.log(`Nouvelle base de données '${newFileName}' connectée avec succès`)
    
    return { 
      success: true, 
      message: `Base de données changée avec succès vers '${newFileName}'` 
    }
  } catch (error) {
    console.error('Erreur lors de la reconnexion:', error)
    return { 
      success: false, 
      message: `Erreur lors du changement de base de données: ${error.message}` 
    }
  }
}
