import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Inscription, Classe, Eleve, AnneeScolaire } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { InscriptionCreateType, InscriptionUpdateType } from './inscription.Type'

export function registerInscriptionController() {
  // CREATE - Créer une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionCreate)
  ipcMain.handle(IPC_CHANNELS.inscriptionCreate, async (_event, inscriptionData: InscriptionCreateType) => {
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
            as: 'anneeScolaire',
            attributes: ['id_annee', 'libelle']
          }
        ]
      })
      
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

  // DELETE - Supprimer une inscription
  ipcMain.removeHandler(IPC_CHANNELS.inscriptionDelete)
  ipcMain.handle(IPC_CHANNELS.inscriptionDelete, async (_event, id_inscription: number) => {
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

      // Vérifier s'il y a des paiements associés à cette inscription
      const { Paiement } = require('../../lib/data-types')
      const paiementCount = await Paiement.count({
        where: { id_inscription }
      })

      if (paiementCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cette inscription car elle est associée à ${paiementCount} paiement(s)`,
          data: null
        }
      }
      
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
    }
  })
}
