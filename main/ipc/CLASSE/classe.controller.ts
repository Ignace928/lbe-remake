import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Classe, Eleve } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { ClasseCreateType, ClasseUpdateType } from './classe.Type'
<<<<<<< HEAD
import { QueryTypes } from 'sequelize'
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

export function registerClasseController() {
  // CREATE - Créer une classe
  ipcMain.removeHandler(IPC_CHANNELS.classeCreate)
  ipcMain.handle(IPC_CHANNELS.classeCreate, async (_event, classeData: ClasseCreateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Vérifier si les délégués et le meilleur élève existent si fournis
      if (classeData.delegue_1) {
        const delegue1 = await Eleve.findByPk(classeData.delegue_1)
        if (!delegue1) {
          return {
            success: false,
            message: 'Le délégué 1 spécifié n\'existe pas',
            data: null
          }
        }
      }

      if (classeData.delegue_2) {
        const delegue2 = await Eleve.findByPk(classeData.delegue_2)
        if (!delegue2) {
          return {
            success: false,
            message: 'Le délégué 2 spécifié n\'existe pas',
            data: null
          }
        }
      }

      if (classeData.meilleur_eleve) {
        const meilleurEleve = await Eleve.findByPk(classeData.meilleur_eleve)
        if (!meilleurEleve) {
          return {
            success: false,
            message: 'Le meilleur élève spécifié n\'existe pas',
            data: null
          }
        }
      }

      // Créer la classe
      const classe = await Classe.create(classeData)
      
      return {
        success: true,
        message: 'Classe créée avec succès',
        data: classe.dataValues
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

  // READ - Obtenir toutes les classes
  ipcMain.removeHandler(IPC_CHANNELS.classeGetAll)
  ipcMain.handle(IPC_CHANNELS.classeGetAll, async (_event) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }
<<<<<<< HEAD
  
      // Requête SQL brute avec jointures pour récupérer uniquement les matricules
      const classesWithMatricules = await sequelize.query(`
        SELECT 
          c.id_classe,
          c.nom_classe,
          c.niveau,
          c.delegue_1,
          c.delegue_2,
          c.meilleur_eleve,
          c.titulaire,
          e1.matricule AS delegue_1_matricule,
          e2.matricule AS delegue_2_matricule,
          m.matricule AS meilleur_eleve_matricule
        FROM CLASSES c
        LEFT JOIN ELEVES e1 ON CAST(c.delegue_1 AS INTEGER) = e1.id_eleve
        LEFT JOIN ELEVES e2 ON CAST(c.delegue_2 AS INTEGER) = e2.id_eleve
        LEFT JOIN ELEVES m ON CAST(c.meilleur_eleve AS INTEGER) = m.id_eleve
        ORDER BY c.nom_classe ASC
      `, {
        type: QueryTypes.SELECT
      })
  
      return {
        success: true,
        message: 'Classes récupérées avec succès',
        data: classesWithMatricules // Contient déjà les données pures sans erreur de clonage
=======

      const classes = await Classe.findAll({
        include: [
          {
            model: Eleve,
            as: 'delegue1',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: Eleve,
            as: 'delegue2',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: Eleve,
            as: 'meilleurEleve',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          }
        ],
        order: [['nom_classe', 'ASC']]
      })
      
      return {
        success: true,
        message: 'Classes récupérées avec succès',
        data: classes
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
<<<<<<< HEAD
})
=======
  })
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

  // READ - Obtenir une classe par ID
  ipcMain.removeHandler(IPC_CHANNELS.classeGetById)
  ipcMain.handle(IPC_CHANNELS.classeGetById, async (_event, id_classe: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const classe = await Classe.findByPk(id_classe, {
        include: [
          {
            model: Eleve,
            as: 'delegue1',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: Eleve,
            as: 'delegue2',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          },
          {
            model: Eleve,
            as: 'meilleurEleve',
            attributes: ['id_eleve', 'nom_eleve', 'post_nom_eleve']
          }
        ]
      })
      
      if (!classe) {
        return {
          success: false,
          message: 'Classe non trouvée',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Classe récupérée avec succès',
        data: classe
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour une classe
  ipcMain.removeHandler(IPC_CHANNELS.classeUpdate)
  ipcMain.handle(IPC_CHANNELS.classeUpdate, async (_event, id_classe: number, classeData: ClasseUpdateType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const classe = await Classe.findByPk(id_classe)
      
      if (!classe) {
        return {
          success: false,
          message: 'Classe non trouvée',
          data: null
        }
      }

      // Vérifier si les délégués et le meilleur élève existent si fournis
      if (classeData.delegue_1 !== undefined) {
        if (classeData.delegue_1) {
          const delegue1 = await Eleve.findByPk(classeData.delegue_1)
          if (!delegue1) {
            return {
              success: false,
              message: 'Le délégué 1 spécifié n\'existe pas',
              data: null
            }
          }
        }
      }

      if (classeData.delegue_2 !== undefined) {
        if (classeData.delegue_2) {
          const delegue2 = await Eleve.findByPk(classeData.delegue_2)
          if (!delegue2) {
            return {
              success: false,
              message: 'Le délégué 2 spécifié n\'existe pas',
              data: null
            }
          }
        }
      }

      if (classeData.meilleur_eleve !== undefined) {
        if (classeData.meilleur_eleve) {
          const meilleurEleve = await Eleve.findByPk(classeData.meilleur_eleve)
          if (!meilleurEleve) {
            return {
              success: false,
              message: 'Le meilleur élève spécifié n\'existe pas',
              data: null
            }
          }
        }
      }
      
      // Mettre à jour la classe
      await classe.update(classeData)
      
      return {
        success: true,
        message: 'Classe mise à jour avec succès',
        data: classe.dataValues
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // DELETE - Supprimer une classe
  ipcMain.removeHandler(IPC_CHANNELS.classeDelete)
  ipcMain.handle(IPC_CHANNELS.classeDelete, async (_event, id_classe: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const classe = await Classe.findByPk(id_classe)
      
      if (!classe) {
        return {
          success: false,
          message: 'Classe non trouvée',
          data: null
        }
      }

      // Vérifier s'il y a des inscriptions associées à cette classe
      const { Inscription } = require('../../lib/data-types')
      const inscriptionCount = await Inscription.count({
        where: { id_classe }
      })

      if (inscriptionCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cette classe car elle est associée à ${inscriptionCount} inscription(s)`,
          data: null
        }
      }

      // Vérifier s'il y a des tarifs associés à cette classe
      const { Tarif } = require('../../lib/data-types')
      const tarifCount = await Tarif.count({
        where: { id_classe }
      })

      if (tarifCount > 0) {
        return {
          success: false,
          message: `Impossible de supprimer cette classe car elle est associée à ${tarifCount} tarif(s)`,
          data: null
        }
      }
      
      // Supprimer la classe
      await classe.destroy()
      
      return {
        success: true,
        message: 'Classe supprimée avec succès',
        data: {
          id_classe: classe.dataValues.id_classe,
          nom_classe: classe.dataValues.nom_classe,
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
