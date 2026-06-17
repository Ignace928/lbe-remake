import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Eleve } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { EleveCreateType, EleveUpdateType, EleveGetAllParams, EleveGetAllResponse } from './eleve.Type'
import { ForeignKeyConstraintError } from 'sequelize'

const generateMatricule = (id_eleve:any, sexe_eleve:any) => {
  const id = id_eleve
  const sexe = sexe_eleve
  const currentYear = new Date().getFullYear()
  const yearCode = currentYear - 2000 // 24 pour 2024
  
  if (id && sexe) {
    const sexeCode = sexe === 'F' ? 'F' : 'M'
    const matricule = `${id}${sexeCode}/${yearCode}`
    return matricule
  }
  return null
}
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
      const lastEleve = await Eleve.findAll({
        order: [['id_eleve', 'DESC']],
        limit: 1,
        attributes: ['id_eleve'],
        raw: true
      })
      
      const nextId = lastEleve.length > 0 ? lastEleve[0].id_eleve + 1 : 1
      const sexe = eleveData.sexe
      const currentYear = new Date().getFullYear()
      const yearCode = currentYear - 2000
      const sexeCode = sexe === 'F' ? 'F' : 'M'
      const matricule = `${nextId}${sexeCode}/${yearCode}`
      
      let createData: any = {
        ...eleveData,
        matricule: matricule,
        created_at: new Date()
      }

      // Si un id_eleve est fourni, l'utiliser pour générer le matricule
      if (eleveData.id_eleve) {
        const customMatricule = generateMatricule(eleveData.id_eleve, eleveData.sexe)
        if (customMatricule) {
          createData = {
            ...eleveData,
            matricule: customMatricule,
            created_at: new Date()
          }
        }
      }
      
      // Créer l'élève
      const eleve = await Eleve.create(createData)
      
      return {
        success: true,
        message: 'Élève créé avec succès',
        data: {
          id_eleve: eleve.dataValues.id_eleve,
          matricule: eleve.dataValues.matricule,
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
      console.error('Stack trace:', error.stack)
      
      return {
        success: false,
        message: `Erreur: ${error.message}`,
        data: null
      }
    }
  })

  // READ - Obtenir tous les élèves (avec pagination optimisée)
  ipcMain.removeHandler(IPC_CHANNELS.eleveGetAll)
  ipcMain.handle(IPC_CHANNELS.eleveGetAll, async (_event, params?: { cursor?: number; limit?: number }) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      // Paramètres de pagination avec valeurs par défaut
      const cursor = params?.cursor || 0
      const limit = Math.min(params?.limit || 50, 100) // Maximum 100 pour éviter la surcharge

      // Requête optimisée avec curseur et limite
      const eleves = await Eleve.findAll({
        order: [['id_eleve', 'DESC']], // Tri par ID pour curseur stable
        limit,
        offset: cursor,
        raw: true,
        attributes: [
          'id_eleve',
          'matricule',
          'nom_eleve',
          'post_nom_eleve',
          'sexe',
          'date_naissance',
          'lieu_naissance',
          'nationalite',
          'adresse',
          'telephone',
          'email',
          'nom_pere',
          'nom_mere',
          'profession_pere',
          'profession_mere',
          'etat',
          'maladie',
          'taille',
          'created_at'
        ] // Sélection explicite des champs pour optimiser
      })
      
      // Récupérer le nombre total pour information (sans charger toutes les données)
      const totalCount = await Eleve.count()
      
      return {
        success: true,
        message: 'Élèves récupérés avec succès',
        data: {
          rows: eleves,
          pagination: {
            cursor: cursor + eleves.length,
            hasMore: cursor + eleves.length < totalCount,
            totalCount,
            currentBatchSize: eleves.length,
            limit
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error)
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
      
      // Générer un nouveau matricule si le sexe a changé
      let updateData = { ...eleveData }
      if (eleveData.sexe && eleveData.sexe !== eleve.dataValues.sexe) {
        const newMatricule = generateMatricule(eleve.dataValues.id_eleve, eleveData.sexe)
        if (newMatricule) {
          updateData.matricule = newMatricule
        }
      }
      
      // Mettre à jour l'élève
      await eleve.update(updateData)
      
      return {
        success: true,
        message: 'Élève mis à jour avec succès',
        data: {
          id_eleve: eleve.dataValues.id_eleve,
          matricule: eleve.dataValues.matricule,
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
      

      // Vérifier si l'élève est délégué ou meilleur élève dans une classe
      
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
      if(error instanceof ForeignKeyConstraintError){
        return {success: false, message:`Cet élève est associé à une inscription`, data:null}
      }
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })
}
