import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Inscription, Classe, Eleve, AnneeScolaire } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { InscriptionCreateType, InscriptionUpdateType } from './inscription.Type'
<<<<<<< HEAD
import { ForeignKeyConstraintError, Op, UniqueConstraintError } from 'sequelize'
import { success } from 'zod'
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

export function registerInscriptionController() {
  // CREATE - Créer une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionCreate)
  ipcMain.handle(IPC_CHANNELS.inscriptionCreate, async (_event, inscriptionData: InscriptionCreateType) => {
<<<<<<< HEAD
    const sequelize = getGlobalSequelize()
    if (!sequelize) {
      return { success: false, message: 'Base de données non initialisée', data: null }
    }
  
    try {
      const inscription = await Inscription.create({
        id_classe: inscriptionData.id_classe,
        id_eleve:  inscriptionData.id_eleve,
        id_annee:  inscriptionData.id_annee,
        somme:     inscriptionData.somme ?? 0,
        passant:   inscriptionData.passant ?? true,
      })
  
      return { success: true, message: 'Inscription créée avec succès', data: inscription.dataValues }
  
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return { success: false, message: "L'élève est déjà inscrit pour cette année scolaire", data: null }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Une valeur référencée (classe, élève ou année) n'existe pas", data: null }
      }
  
      return { success: false, message: "Une erreur est survenue lors de la création de l'inscription", data: null }
    }
  })

  // READ - Obtenir les inscriptions d'une classe pour une année
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionGetAllThisYear)
  ipcMain.handle(IPC_CHANNELS.inscriptionGetAllThisYear, async (_event, params?: { cursor?: number; limit?: number; id_anne?: string; id_classe?: number }) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return { success: false, message: 'Base de données non initialisée', data: [] }
      }

      const cursor = params?.cursor || 0
      const limit = Math.min(params?.limit || 100, 200)

      const result = await Inscription.findAndCountAll({
        where: {
          [Op.and]: [
            { id_annee: params?.id_anne || "" },
            { id_classe: params?.id_classe || 1 }
          ]
        },
        limit,
        offset: cursor,
        include: [
          {
            model: Classe,
            required:true,
=======
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Vérifier si la classe existe
      const classe = await Classe.findByPk(inscriptionData.id_classe)
      if (!classe) {
        return {
          success: false,
          message: 'La classe spécifiée n\'existe pas',
          data: null
        }
      }

      // Vérifier si l'élève existe
      const eleve = await Eleve.findByPk(inscriptionData.id_eleve)
      if (!eleve) {
        return {
          success: false,
          message: 'L\'élève spécifié n\'existe pas',
          data: null
        }
      }

      // Vérifier si l'année scolaire existe
      const anneeScolaire = await AnneeScolaire.findByPk(inscriptionData.id_annee)
      if (!anneeScolaire) {
        return {
          success: false,
          message: 'L\'année scolaire spécifiée n\'existe pas',
          data: null
        }
      }

      // Vérifier si l'élève n'est pas déjà inscrit dans cette classe pour cette année
      const existingInscription = await Inscription.findOne({
        where: {
          id_eleve: inscriptionData.id_eleve,
          id_classe: inscriptionData.id_classe,
          id_annee: inscriptionData.id_annee
        }
      })

      if (existingInscription) {
        return {
          success: false,
          message: 'Cet élève est déjà inscrit dans cette classe pour cette année scolaire',
          data: null
        }
      }

      // Créer l'inscription
      const inscription = await Inscription.create({
        ...inscriptionData,
        passant: inscriptionData.passant !== undefined ? inscriptionData.passant : true
      })
      
      return {
        success: true,
        message: 'Inscription créée avec succès',
        data: inscription.dataValues
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

  // READ - Obtenir toutes les inscriptions
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionGetAll)
  ipcMain.handle(IPC_CHANNELS.inscriptionGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const inscriptions = await Inscription.findAll({
        include: [
          {
            model: Classe,
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
            as: 'classe',
            attributes: ['id_classe', 'nom_classe', 'niveau']
          },
          {
            model: Eleve,
<<<<<<< HEAD
            required:true,
            as: 'eleve',
            attributes: ['id_eleve', "matricule", 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: AnneeScolaire,
            required:true,
=======
            as: 'eleve',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve', 'sexe']
          },
          {
            model: AnneeScolaire,
            as: 'anneeScolaire',
            attributes: ['id_annee', 'libelle']
          }
        ],
        order: [['id_annee', 'DESC'], ['nom_classe', 'ASC'], ['nom_eleve', 'ASC']]
      })
      
      return {
        success: true,
        message: 'Inscriptions récupérées avec succès',
        data: inscriptions
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir une inscription par ID
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionGetById)
  ipcMain.handle(IPC_CHANNELS.inscriptionGetById, async (_event, id_inscription: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const inscription = await Inscription.findByPk(id_inscription, {
        include: [
          {
            model: Classe,
            as: 'classe',
            attributes: ['id_classe', 'nom_classe', 'niveau']
          },
          {
            model: Eleve,
            as: 'eleve',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve', 'sexe']
          },
          {
            model: AnneeScolaire,
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
            as: 'anneeScolaire',
            attributes: ['id_annee', 'libelle']
          }
        ]
      })
<<<<<<< HEAD

      // Extraction propre des données
      const rows = result.rows.map(inscription => {
        const data = inscription.dataValues
        
        // Extraire les associations depuis dataValues si elles existent
        const extractAssociation = (assocData: any) => {
          if (!assocData) return null
          // Si assocData a dataValues, extraire de là, sinon utiliser directement
          const assoc = assocData.dataValues || assocData
          return {
            id_classe: assoc.id_classe,
            nom_classe: assoc.nom_classe,
            niveau: assoc.niveau,
            id_eleve: assoc.id_eleve,
            matricule: assoc.matricule,
            nom_eleve: assoc.nom_eleve,
            post_nom_eleve: assoc.post_nom_eleve,
            sexe: assoc.sexe,
            id_annee: assoc.id_annee,
            libelle: assoc.libelle
          }
        }
        
        return {
          id_inscription: data.id_inscription,
          id_classe: data.id_classe,
          id_eleve: data.id_eleve,
          id_annee: data.id_annee,
          somme: data.somme,
          passant: data.passant,
          classe: data.classe ? extractAssociation(data.classe) : null,
          eleve: data.eleve ? extractAssociation(data.eleve) : null,
          anneeScolaire: data.anneeScolaire ? extractAssociation(data.anneeScolaire) : null
        }
      })

      return {
        success: true,
        message: 'Inscriptions récupérées avec succès',
        data: {
          rows,
          pagination: {
            cursor: cursor + rows.length,
            hasMore: cursor + rows.length < result.count,
            totalCount: result.count,
            currentBatchSize: rows.length,
            limit
          }
        }
      }
    } catch (error) {
      return { success: false, message: error.message, data: [] }
    }
  })





  //By Id ELEVE POUR UNE ANNE DONNE
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionGetById)
  ipcMain.handle(IPC_CHANNELS.inscriptionGetById, async(_event, params?:{id_eleve?:number, id_anne?:string})=>{
    const sequelize = getGlobalSequelize()
    if (!sequelize) {
      return { success: false, message: 'Base de données non initialisée', data: null }
    }
    try {
      const result = await Inscription.findOne({
        where:{
          [Op.and]: [
            { id_eleve: params?.id_eleve || 0},
            { id_annee: params?.id_anne || "" }
          ]
        },
        include: [
          {
            model: Classe,
            required:true,
            as: 'classe',
            attributes: ['id_classe','nom_classe']
          },
          {
            model: Eleve,
            required:true,
            as: 'eleve',
            attributes: ["matricule", 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: AnneeScolaire,
            required:true,
            as: 'anneeScolaire',
            attributes: ['libelle']
          }
        ]
      })
      // Extraction propre des données
      const inscription = (res:any)=>{
        const result = res.dataValues
        return {
            id_inscription: result.id_inscription,
            id_classe: result.id_classe,
            id_eleve: result.id_eleve,
            id_annee: result.id_annee,
            somme: result.somme,
            passant: result.passant,
            classe: result.classe ? {
              id_classe:result.classe.dataValues.id_classe,
              nom_classe:result.classe.dataValues.nom_classe
            } : null,
            eleve: result.eleve ? {
              matricule:result.eleve.dataValues.matricule || null, 
              nom_eleve:result.eleve.dataValues.nom_eleve || "",
              post_nom_eleve:result.eleve.dataValues.post_nom_eleve || "" 
            }: null,
            anneeScolaire: result.anneeScolaire ? {
              libelle: result.anneeScolaire.dataValues.libelle || ""
            } : null
        }
      }
        return{
          success:true,
          message:"Trouver👌",
          data:inscription(result)
        }
    } catch (error) {
      return{success:false,message:"Auccun eleve trouvé",data:null}
    }
  })







  // UPDATE - Mettre à jour une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionUpdate)
  ipcMain.handle(IPC_CHANNELS.inscriptionUpdate, async (_event, id_inscription: number, inscriptionData: InscriptionUpdateType) => {
    const sequelize = getGlobalSequelize()
    if (!sequelize) {
      return { success: false, message: 'Base de données non initialisée', data: null }
    }
  
    try {
      const inscription = await Inscription.findByPk(id_inscription)
      if (!inscription) {
        return { success: false, message: 'Inscription non trouvée', data: null }
      }
  
      await inscription.update({
        id_classe: inscriptionData.id_classe,
        id_eleve:  inscriptionData.id_eleve,
        id_annee:  inscriptionData.id_annee,
        somme:     inscriptionData.somme,
        passant:   inscriptionData.passant,
      })
  
      return { success: true, message: 'Inscription mise à jour avec succès', data: inscription.dataValues }
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'inscription:", error)
  
      if (error instanceof UniqueConstraintError) {
        return { success: false, message: "L'élève est déjà inscrit pour cette année scolaire", data: null }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Une valeur référencée (classe, élève ou année) n'existe pas", data: null }
      }
  
      return { success: false, message: "Une erreur est survenue lors de la mise à jour", data: null }
    }
  }),
=======
      
      if (!inscription) {
        return {
          success: false,
          message: 'Inscription non trouvée',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Inscription récupérée avec succès',
        data: inscription
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionUpdate)
  ipcMain.handle(IPC_CHANNELS.inscriptionUpdate, async (_event, id_inscription: number, inscriptionData: InscriptionUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const inscription = await Inscription.findByPk(id_inscription)
      
      if (!inscription) {
        return {
          success: false,
          message: 'Inscription non trouvée',
          data: null
        }
      }

      // Vérifier les associations si elles sont fournies
      if (inscriptionData.id_classe !== undefined) {
        const classe = await Classe.findByPk(inscriptionData.id_classe)
        if (!classe) {
          return {
            success: false,
            message: 'La classe spécifiée n\'existe pas',
            data: null
          }
        }
      }

      if (inscriptionData.id_eleve !== undefined) {
        const eleve = await Eleve.findByPk(inscriptionData.id_eleve)
        if (!eleve) {
          return {
            success: false,
            message: 'L\'élève spécifié n\'existe pas',
            data: null
          }
        }
      }

      if (inscriptionData.id_annee !== undefined) {
        const anneeScolaire = await AnneeScolaire.findByPk(inscriptionData.id_annee)
        if (!anneeScolaire) {
          return {
            success: false,
            message: 'L\'année scolaire spécifiée n\'existe pas',
            data: null
          }
        }
      }
      
      // Mettre à jour l'inscription
      await inscription.update(inscriptionData)
      
      return {
        success: true,
        message: 'Inscription mise à jour avec succès',
        data: inscription.dataValues
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

  // DELETE - Supprimer une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionDelete)
  ipcMain.handle(IPC_CHANNELS.inscriptionDelete, async (_event, id_inscription: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
<<<<<<< HEAD
        return { success: false, message: 'Base de données non initialisée', data: null }
      }

      const inscription = await Inscription.findByPk(id_inscription)
      if (!inscription) {
        return { success: false, message: 'Inscription non trouvée', data: null }
      }

      // Vérifier s'il y a des paiements associés
      const { Paiement } = require('../../lib/data-types')
      const paiementCount = await Paiement.count({ where: { id_inscription } })
=======
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const inscription = await Inscription.findByPk(id_inscription)
      
      if (!inscription) {
        return {
          success: false,
          message: 'Inscription non trouvée',
          data: null
        }
      }

      // Vérifier s'il y a des paiements associés à cette inscription
      const { Paiement } = require('../../lib/data-types')
      const paiementCount = await Paiement.count({
        where: { id_inscription }
      })
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

      if (paiementCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cette inscription car elle est associée à ${paiementCount} paiement(s)`,
          data: null
        }
      }
<<<<<<< HEAD

      // Supprimer l'inscription
      await inscription.destroy()

      return {
        success: true,
        message: 'Inscription supprimée avec succès',
        data: { id_inscription: inscription.dataValues.id_inscription }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'inscription:", error)

      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Impossible de supprimer cette inscription car elle a des données associées", data: null }
      }

      return { success: false, message: "Une erreur est survenue lors de la suppression", data: null }
    
=======
      
      // Supprimer l'inscription
      await inscription.destroy()
      
      return {
        success: true,
        message: 'Inscription supprimée avec succès',
        data: {
          id_inscription: inscription.dataValues.id_inscription,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  })
}
