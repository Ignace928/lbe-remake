import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { TypeFrais } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { TypeFraisCreateType, TypeFraisUpdateType } from './typeFrais.Type'
import { UniqueConstraintError } from 'sequelize'

export function registerTypeFraisController() {
  // CREATE - Créer un type de frais
  ipcMain.removeHandler(IPC_CHANNELS.typeFraisCreate)
  ipcMain.handle(IPC_CHANNELS.typeFraisCreate, async (_event, typeFraisData: TypeFraisCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Créer le type de frais
      const typeFrais = await TypeFrais.create(typeFraisData)
      
      return {
        success: true,
        message: 'Type de frais créé avec succès',
        data: typeFrais.dataValues
      }
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return { success: false, message: "Cette type existe déjà🥱", data: null }
      }
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // READ - Obtenir tous les types de frais
  ipcMain.removeHandler(IPC_CHANNELS.typeFraisGetAll)
  ipcMain.handle(IPC_CHANNELS.typeFraisGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const typesFrais = await TypeFrais.findAll({
        order: [['libelle', 'ASC']]
      })
      
      return {
        success: true,
        message: 'Types de frais récupérés avec succès',
        data: typesFrais
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un type de frais par ID
  ipcMain.removeHandler(IPC_CHANNELS.typeFraisGetById)
  ipcMain.handle(IPC_CHANNELS.typeFraisGetById, async (_event, id_type_frais: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const typeFrais = await TypeFrais.findByPk(id_type_frais)
      
      if (!typeFrais) {
        return {
          success: false,
          message: 'Type de frais non trouvé',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Type de frais récupéré avec succès',
        data: typeFrais
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour un type de frais
  ipcMain.removeHandler(IPC_CHANNELS.typeFraisUpdate)
  ipcMain.handle(IPC_CHANNELS.typeFraisUpdate, async (_event, id_type_frais: number, typeFraisData: TypeFraisUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const typeFrais = await TypeFrais.findByPk(id_type_frais)
      
      if (!typeFrais) {
        return {
          success: false,
          message: 'Type de frais non trouvé',
          data: null
        }
      }

      // Si le libelle est fourni, vérifier s'il n'existe pas déjà pour un autre type
      if (typeFraisData.libelle !== undefined) {
        const existingTypeFrais = await TypeFrais.findOne({
          where: { 
            libelle: typeFraisData.libelle,
            id_type_frais: { [sequelize.Sequelize.Op.ne]: id_type_frais }
          }
        })

        if (existingTypeFrais) {
          return {
            success: false,
            message: 'Un type de frais avec ce libellé existe déjà',
            data: null
          }
        }
      }
      
      // Mettre à jour le type de frais
      await typeFrais.update(typeFraisData)
      
      return {
        success: true,
        message: 'Type de frais mis à jour avec succès',
        data: typeFrais.dataValues
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // DELETE - Supprimer un type de frais
  ipcMain.removeHandler(IPC_CHANNELS.typeFraisDelete)
  ipcMain.handle(IPC_CHANNELS.typeFraisDelete, async (_event, id_type_frais: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const typeFrais = await TypeFrais.findByPk(id_type_frais)
      
      if (!typeFrais) {
        return {
          success: false,
          message: 'Type de frais non trouvé',
          data: null
        }
      }

      // Vérifier s'il y a des tarifs associés à ce type de frais
      const { Tarif } = require('../../lib/data-types')
      const tarifCount = await Tarif.count({
        where: { id_type_frais }
      })

      if (tarifCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer ce type de frais car il est associé à ${tarifCount} tarif(s)`,
          data: null
        }
      }

      // Vérifier s'il y a des paiements associés à ce type de frais
      const { Paiement } = require('../../lib/data-types')
      const paiementCount = await Paiement.count({
        where: { id_type_frais }
      })

      if (paiementCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer ce type de frais car il est associé à ${paiementCount} paiement(s)`,
          data: null
        }
      }
      
      // Supprimer le type de frais
      await typeFrais.destroy()
      
      return {
        success: true,
        message: 'Type de frais supprimé avec succès',
        data: {
          id_type_frais: typeFrais.dataValues.id_type_frais,
          libelle: typeFrais.dataValues.libelle,
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
