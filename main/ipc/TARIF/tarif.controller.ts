import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Tarif, Classe, AnneeScolaire, TypeFrais } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { TarifCreateType, TarifUpdateType } from './tarif.Type'
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize'

export function registerTarifController() {
  // CREATE - Créer un tarif
  ipcMain.removeHandler(IPC_CHANNELS.tarifCreate)
  ipcMain.handle(IPC_CHANNELS.tarifCreate, async (_event, tarifData: TarifCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      
      // Créer le tarif
      const tarif = await Tarif.create(tarifData)
      
      return {
        success: true,
        message: 'Tarif créé avec succès',
        data: tarif.dataValues
      }
    } catch (error) {
      if(error instanceof UniqueConstraintError){
        return{
          success: false, message:"Le Tarif existe déjà pour cette classe 😴", data:null
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Une valeur référencée (tarif ou classe) n'existe pas", data: null }
      }
      
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // READ - Obtenir tous les tarifs
  ipcMain.removeHandler(IPC_CHANNELS.tarifGetAll)
  ipcMain.handle(IPC_CHANNELS.tarifGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const result = await Tarif.findAll({
        include: [
          {
            model: Classe,
            as: 'classe',
            attributes: ['id_classe', 'nom_classe', 'niveau']
          },
          {
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle', 'detail']
          }
        ],
      })

      const rows = result.map(tarif => {
        const data = tarif.dataValues
        // Extraire les associations depuis dataValues si elles existent
        return {
          id_tarif: data.id_tarif,
          id_classe: data.id_classe,
          id_type_frais:data.id_type_frais,
          montant_fixe: data.montant_fixe,
          classe: data.classe ? {
            id_classe:data.classe.dataValues.id_classe,
            nom_classe:data.classe.dataValues.nom_classe,
            niveau:data.classe.dataValues.niveau
          }: null,
          typeFrais: data.typeFrais ? {
            id_type_frais:data.typeFrais.dataValues.id_type_frais,
            libelle:data.typeFrais.dataValues.libelle,
            detail:data.typeFrais.dataValues.detail
          }: null,
        }
      })
      return {
        success: true,
        message: 'Tarifs récupérés avec succès',
        data: rows,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un tarif par ID
  ipcMain.removeHandler(IPC_CHANNELS.tarifGetById)
  ipcMain.handle(IPC_CHANNELS.tarifGetById, async (_event, id_tarif: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const tarif = await Tarif.findByPk(id_tarif, {
        include: [
          {
            model: Classe,
            as: 'classe',
            attributes: ['id_classe', 'nom_classe', 'niveau']
          },
          {
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle', 'detail']
          }
        ]
      })
      
      if (!tarif) {
        return {
          success: false,
          message: 'Tarif non trouvé',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Tarif récupéré avec succès',
        data: tarif
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour un tarif
  ipcMain.removeHandler(IPC_CHANNELS.tarifUpdate)
  ipcMain.handle(IPC_CHANNELS.tarifUpdate, async (_event, id_tarif: number, tarifData: TarifUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const tarif = await Tarif.findByPk(id_tarif)
      
      if (!tarif) {
        return {
          success: false,
          message: 'Tarif non trouvé',
          data: null
        }
      }

      
      
      // Mettre à jour le tarif
      await tarif.update(tarifData)
      
      return {
        success: true,
        message: 'Tarif mis à jour avec succès',
        data: tarif.dataValues
      }
    } catch (error) {
      if(error instanceof UniqueConstraintError){
        return{
          success: false, message:"Mise à jour impossible 😴!! Tarif existe déjà pour cette classe ", data:null
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Modification impossible 😴!! (tarif ou classe) n'existe pas", data: null }
      }
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // DELETE - Supprimer un tarif
  ipcMain.removeHandler(IPC_CHANNELS.tarifDelete)
  ipcMain.handle(IPC_CHANNELS.tarifDelete, async (_event, id_tarif: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const tarif = await Tarif.findByPk(id_tarif)
      
      if (!tarif) {
        return {
          success: false,
          message: 'Le tarif est introuvalble 🥱!!',
          data: null
        }
      }
      
      // Supprimer le tarif
      await tarif.destroy()
      
      return {
        success: true,
        message: 'Tarif supprimé avec succès',
        data: {
          id_tarif: tarif.dataValues.id_tarif,
          montant_fixe: tarif.dataValues.montant_fixe,
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
