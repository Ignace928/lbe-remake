import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Paiement, Inscription, TypeFrais } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { PaiementCreateType, PaiementUpdateType } from './paiement.Type'

export function registerPaiementController() {
  // CREATE - Créer un paiement
  ipcMain.removeHandler(IPC_CHANNELS.paiementCreate)
  ipcMain.handle(IPC_CHANNELS.paiementCreate, async (_event, paiementData: PaiementCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Vérifier si l'inscription existe
      const inscription = await Inscription.findByPk(paiementData.id_inscription, {
        include: [
          {
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle']
          }
        ]
      })
      if (!inscription) {
        return {
          success: false,
          message: 'L\'inscription spécifiée n\'existe pas',
          data: null
        }
      }

      // Vérifier si le type de frais existe
      const typeFrais = await TypeFrais.findByPk(paiementData.id_type_frais)
      if (!typeFrais) {
        return {
          success: false,
          message: 'Le type de frais spécifié n\'existe pas',
          data: null
        }
      }

      // Vérifier si la référence existe déjà
      const existingPaiement = await Paiement.findOne({
        where: { ref: paiementData.ref }
      })

      if (existingPaiement) {
        return {
          success: false,
          message: 'Un paiement avec cette référence existe déjà',
          data: null
        }
      }

      // Créer le paiement
      const paiement = await Paiement.create(paiementData)
      
      return {
        success: true,
        message: 'Paiement créé avec succès',
        data: paiement.dataValues
      }
    } catch (error) {
      console.error('Erreur détaillée lors de la création:', error)
      
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // READ - Obtenir tous les paiements
  ipcMain.removeHandler(IPC_CHANNELS.paiementGetAll)
  ipcMain.handle(IPC_CHANNELS.paiementGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const paiements = await Paiement.findAll({
        include: [
          {
            model: Inscription,
            as: 'inscription',
            attributes: ['id_inscription'],
            include: [
              {
                model: require('../../lib/data-types').Eleve,
                as: 'eleve',
                attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
              },
              {
                model: require('../../lib/data-types').Classe,
                as: 'classe',
                attributes: ['id_classe', 'nom_classe', 'niveau']
              },
              {
                model: require('../../lib/data-types').AnneeScolaire,
                as: 'anneeScolaire',
                attributes: ['id_annee', 'libelle']
              }
            ]
          },
          {
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle', 'detail']
          }
        ],
        order: [['date_paiement', 'DESC'], ['ref', 'ASC']]
      })
      
      return {
        success: true,
        message: 'Paiements récupérés avec succès',
        data: paiements
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un paiement par ID
  ipcMain.removeHandler(IPC_CHANNELS.paiementGetById)
  ipcMain.handle(IPC_CHANNELS.paiementGetById, async (_event, id_paiement: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const paiement = await Paiement.findByPk(id_paiement, {
        include: [
          {
            model: Inscription,
            as: 'inscription',
            attributes: ['id_inscription'],
            include: [
              {
                model: require('../../lib/data-types').Eleve,
                as: 'eleve',
                attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
              },
              {
                model: require('../../lib/data-types').Classe,
                as: 'classe',
                attributes: ['id_classe', 'nom_classe', 'niveau']
              },
              {
                model: require('../../lib/data-types').AnneeScolaire,
                as: 'anneeScolaire',
                attributes: ['id_annee', 'libelle']
              }
            ]
          },
          {
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle', 'detail']
          }
        ]
      })
      
      if (!paiement) {
        return {
          success: false,
          message: 'Paiement non trouvé',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Paiement récupéré avec succès',
        data: paiement
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour un paiement
  ipcMain.removeHandler(IPC_CHANNELS.paiementUpdate)
  ipcMain.handle(IPC_CHANNELS.paiementUpdate, async (_event, id_paiement: number, paiementData: PaiementUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const paiement = await Paiement.findByPk(id_paiement)
      
      if (!paiement) {
        return {
          success: false,
          message: 'Paiement non trouvé',
          data: null
        }
      }

      // Vérifier les associations si elles sont fournies
      if (paiementData.id_inscription !== undefined) {
        const inscription = await Inscription.findByPk(paiementData.id_inscription)
        if (!inscription) {
          return {
            success: false,
            message: 'L\'inscription spécifiée n\'existe pas',
            data: null
          }
        }
      }

      if (paiementData.id_type_frais !== undefined) {
        const typeFrais = await TypeFrais.findByPk(paiementData.id_type_frais)
        if (!typeFrais) {
          return {
            success: false,
            message: 'Le type de frais spécifié n\'existe pas',
            data: null
          }
        }
      }

      // Si la référence est fournie, vérifier si elle n'existe pas déjà pour un autre paiement
      if (paiementData.ref !== undefined) {
        const existingPaiement = await Paiement.findOne({
          where: { 
            ref: paiementData.ref,
            id_paiement: { [sequelize.Sequelize.Op.ne]: id_paiement }
          }
        })

        if (existingPaiement) {
          return {
            success: false,
            message: 'Un paiement avec cette référence existe déjà',
            data: null
          }
        }
      }
      
      // Mettre à jour le paiement
      await paiement.update(paiementData)
      
      return {
        success: true,
        message: 'Paiement mis à jour avec succès',
        data: paiement.dataValues
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // DELETE - Supprimer un paiement
  ipcMain.removeHandler(IPC_CHANNELS.paiementDelete)
  ipcMain.handle(IPC_CHANNELS.paiementDelete, async (_event, id_paiement: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const paiement = await Paiement.findByPk(id_paiement)
      
      if (!paiement) {
        return {
          success: false,
          message: 'Paiement non trouvé',
          data: null
        }
      }
      
      // Supprimer le paiement
      await paiement.destroy()
      
      return {
        success: true,
        message: 'Paiement supprimé avec succès',
        data: {
          id_paiement: paiement.dataValues.id_paiement,
          ref: paiement.dataValues.ref,
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
