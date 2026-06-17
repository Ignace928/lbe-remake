import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Eleve } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { EleveCreateType, EleveUpdateType } from './eleve.Type'

export function registerEleveController() {
  // CREATE - Créer un élève
  ipcMain.removeHandler(IPC_CHANNELS.eleveCreate)
  ipcMain.handle(IPC_CHANNELS.eleveCreate, async (_event, eleveData: EleveCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      let createData: any = {
        ...eleveData,
        created_at: new Date()
      }

      // Si la table est vide et qu'un id_eleve est fourni, l'utiliser
      if (eleveData.id_eleve) {
        createData.id_eleve = eleveData.id_eleve
      }
      // Sinon, laisser l'auto-incrément gérer
      
      // Créer l'élève
      const eleve = await Eleve.create(createData)
      
      return {
        success: true,
        message: 'Élève créé avec succès',
        data: {
          id_eleve: eleve.dataValues.id_eleve,
          nom_eleve: eleve.dataValues.nom_eleve,
          post_nom_eleve: eleve.dataValues.post_nom_eleve,
          sexe: eleve.dataValues.sexe,
          date_naissance: eleve.dataValues.date_naissance,
          lieu_naissance: eleve.dataValues.lieu_naissance,
          nationalite: eleve.dataValues.nationalite,
          adresse: eleve.dataValues.adresse,
          telephone: eleve.dataValues.telephone,
          email: eleve.dataValues.email,
          nom_pere: eleve.dataValues.nom_pere,
          nom_mere: eleve.dataValues.nom_mere,
          profession_pere: eleve.dataValues.profession_pere,
          profession_mere: eleve.dataValues.profession_mere,
          etat: eleve.dataValues.etat,
          maladie: eleve.dataValues.maladie,
          taille: eleve.dataValues.taille,
          created_at: eleve.dataValues.created_at,
        }
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

  // READ - Obtenir tous les élèves
  ipcMain.removeHandler(IPC_CHANNELS.eleveGetAll)
  ipcMain.handle(IPC_CHANNELS.eleveGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const eleves = await Eleve.findAll({
        order: [['nom_eleve', 'ASC']],
        raw: true
      })
      
      return {
        success: true,
        message: 'Élèves récupérés avec succès',
        data: eleves
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un élève par ID
  ipcMain.removeHandler(IPC_CHANNELS.eleveGetById)
  ipcMain.handle(IPC_CHANNELS.eleveGetById, async (_event, id_eleve: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const eleve = await Eleve.findByPk(id_eleve, {
        raw: true
      })
      
      if (!eleve) {
        return {
          success: false,
          message: 'Élève non trouvé',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Élève récupéré avec succès',
        data: eleve
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour un élève
  ipcMain.removeHandler(IPC_CHANNELS.eleveUpdate)
  ipcMain.handle(IPC_CHANNELS.eleveUpdate, async (_event, id_eleve: number, eleveData: EleveUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const eleve = await Eleve.findByPk(id_eleve)
      
      if (!eleve) {
        return {
          success: false,
          message: 'Élève non trouvé',
          data: null
        }
      }
      
      // Mettre à jour l'élève
      await eleve.update(eleveData)
      
      return {
        success: true,
        message: 'Élève mis à jour avec succès',
        data: {
          id_eleve: eleve.dataValues.id_eleve,
          nom_eleve: eleve.dataValues.nom_eleve,
          bapteme: eleve.dataValues.bapteme,
          sexe: eleve.dataValues.sexe,
          date_de_naissance: eleve.dataValues.date_de_naissance,
          lieu_de_naissance: eleve.dataValues.lieu_de_naissance,
          pere: eleve.dataValues.pere,
          mere: eleve.dataValues.mere,
          tel: eleve.dataValues.tel,
          adresse: eleve.dataValues.adresse,
          tutelle: eleve.dataValues.tutelle,
          tel_tutelle: eleve.dataValues.tel_tutelle,
          address_tutelle: eleve.dataValues.address_tutelle,
          religion: eleve.dataValues.religion,
          maladie: eleve.dataValues.maladie,
          taille: eleve.dataValues.taille,
          created_at: eleve.dataValues.created_at,
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

  // DELETE - Supprimer un élève
  ipcMain.removeHandler(IPC_CHANNELS.eleveDelete)
  ipcMain.handle(IPC_CHANNELS.eleveDelete, async (_event, id_eleve: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const eleve = await Eleve.findByPk(id_eleve)
      
      if (!eleve) {
        return {
          success: false,
          message: 'Élève non trouvé',
          data: null
        }
      }

      // Vérifier s'il y a des inscriptions associées à cet élève
      const { Inscription } = require('../../lib/data-types')
      const inscriptionCount = await Inscription.count({
        where: { id_eleve }
      })

      if (inscriptionCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cet élève car il est associé à ${inscriptionCount} inscription(s)`,
          data: null
        }
      }

      // Vérifier si l'élève est délégué ou meilleur élève dans une classe
      const { Classe } = require('../../lib/data-types')
      const classeCount = await Classe.count({
        where: {
          [sequelize.Sequelize.Op.or]: [
            { delegue_1: id_eleve },
            { delegue_2: id_eleve },
            { meilleur_eleve: id_eleve }
          ]
        }
      })

      if (classeCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cet élève car il est délégué ou meilleur élève dans ${classeCount} classe(s)`,
          data: null
        }
      }
      
      // Supprimer l'élève
      await eleve.destroy()
      
      return {
        success: true,
        message: 'Élève supprimé avec succès',
        data: {
          id_eleve: eleve.dataValues.id_eleve,
          matricule: `${eleve.dataValues.id_eleve}${eleve.dataValues.sexe}/...`,
          nom_eleve: eleve.dataValues.nom_eleve,
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
