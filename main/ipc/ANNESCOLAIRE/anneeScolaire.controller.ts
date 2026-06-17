import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { AnneeScolaire } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { AnneeScolaireCreateType, AnneeScolaireUpdateType } from './anneeScolaire.Type'

export function registerAnneeScolaireController() {
  // CREATE - Créer une année scolaire
  ipcMain.removeHandler(IPC_CHANNELS.anneeScolaireCreate)
  ipcMain.handle(IPC_CHANNELS.anneeScolaireCreate, async (_event, anneeData: AnneeScolaireCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Vérifier si le libelle existe déjà
      const existingAnnee = await AnneeScolaire.findOne({
        where: { libelle: anneeData.libelle }
      })

      if (existingAnnee) {
        return {
          success: false,
          message: 'Cette année scolaire existe déjà',
          data: null
        }
      }
      
      // Créer l'année scolaire
      const annee = await AnneeScolaire.create({
        libelle: anneeData.libelle,
      })
      
      return {
        success: true,
        message: 'Année scolaire créée avec succès',
        data: {
          id_annee: annee.dataValues.id_annee,
          libelle: annee.dataValues.libelle,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // READ - Obtenir toutes les années scolaires
  ipcMain.removeHandler(IPC_CHANNELS.anneeScolaireGetAll)
  ipcMain.handle(IPC_CHANNELS.anneeScolaireGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const annees = await AnneeScolaire.findAll({
        order: [['libelle', 'DESC']], // Ordre décroissant pour avoir les plus récentes d'abord
        raw: true
      })
      
      return {
        success: true,
        message: 'Années scolaires récupérées avec succès',
        data: annees
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir une année scolaire par ID
  ipcMain.removeHandler(IPC_CHANNELS.anneeScolaireGetById)
  ipcMain.handle(IPC_CHANNELS.anneeScolaireGetById, async (_event, id_annee: string) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const annee = await AnneeScolaire.findByPk(id_annee, {
        raw: true
      })
      
      if (!annee) {
        return {
          success: false,
          message: 'Année scolaire non trouvée',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Année scolaire récupérée avec succès',
        data: annee
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour une année scolaire
  ipcMain.removeHandler(IPC_CHANNELS.anneeScolaireUpdate)
  ipcMain.handle(IPC_CHANNELS.anneeScolaireUpdate, async (_event, id_annee: string, anneeData: AnneeScolaireUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const annee = await AnneeScolaire.findByPk(id_annee)
      
      if (!annee) {
        return {
          success: false,
          message: 'Année scolaire non trouvée',
          data: null
        }
      }

      // Si on met à jour le libelle, vérifier qu'il n'existe pas déjà
      if (anneeData.libelle) {
        const existingAnnee = await AnneeScolaire.findOne({
          where: { 
            libelle: anneeData.libelle,
            id_annee: { [sequelize.Sequelize.Op.ne]: id_annee } // Exclure l'année actuelle
          }
        })

        if (existingAnnee) {
          return {
            success: false,
            message: 'Cette année scolaire existe déjà',
            data: null
          }
        }
      }
      
      // Mettre à jour l'année scolaire
      await annee.update(anneeData)
      
      return {
        success: true,
        message: 'Année scolaire mise à jour avec succès',
        data: {
          id_annee: annee.dataValues.id_annee,
          libelle: annee.dataValues.libelle,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // DELETE - Supprimer une année scolaire
  ipcMain.removeHandler(IPC_CHANNELS.anneeScolaireDelete)
  ipcMain.handle(IPC_CHANNELS.anneeScolaireDelete, async (_event, id_annee: string) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const annee = await AnneeScolaire.findByPk(id_annee)
      
      if (!annee) {
        return {
          success: false,
          message: 'Année scolaire non trouvée',
          data: null
        }
      }

      // Vérifier s'il y a des inscriptions associées à cette année
      const { Inscription } = require('../../lib/data-types')
      const inscriptionCount = await Inscription.count({
        where: { id_annee }
      })

      if (inscriptionCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cette année scolaire car elle est associée à ${inscriptionCount} inscription(s)`,
          data: null
        }
      }
      
      // Supprimer l'année scolaire
      await annee.destroy()
      
      return {
        success: true,
        message: 'Année scolaire supprimée avec succès',
        data: {
          id_annee: annee.dataValues.id_annee,
          libelle: annee.dataValues.libelle,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })
}
