import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Tarif, Classe, AnneeScolaire, TypeFrais } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { TarifCreateType, TarifUpdateType } from './tarif.Type'
<<<<<<< HEAD
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize'
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

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

<<<<<<< HEAD
      
=======
      // Vérifier si la classe existe
      const classe = await Classe.findByPk(tarifData.id_classe)
      if (!classe) {
        return {
          success: false,
          message: 'La classe spécifiée n\'existe pas',
          data: null
        }
      }

      // Vérifier si l'année scolaire existe
      const anneeScolaire = await AnneeScolaire.findByPk(tarifData.id_annee)
      if (!anneeScolaire) {
        return {
          success: false,
          message: 'L\'année scolaire spécifiée n\'existe pas',
          data: null
        }
      }

      // Vérifier si le type de frais existe
      const typeFrais = await TypeFrais.findByPk(tarifData.id_type_frais)
      if (!typeFrais) {
        return {
          success: false,
          message: 'Le type de frais spécifié n\'existe pas',
          data: null
        }
      }

      // Vérifier si un tarif existe déjà pour cette combinaison
      const existingTarif = await Tarif.findOne({
        where: {
          id_classe: tarifData.id_classe,
          id_annee: tarifData.id_annee,
          id_type_frais: tarifData.id_type_frais
        }
      })

      if (existingTarif) {
        return {
          success: false,
          message: 'Un tarif existe déjà pour cette combinaison classe-année-type de frais',
          data: null
        }
      }

>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      // Créer le tarif
      const tarif = await Tarif.create(tarifData)
      
      return {
        success: true,
        message: 'Tarif créé avec succès',
        data: tarif.dataValues
      }
    } catch (error) {
<<<<<<< HEAD
      if(error instanceof UniqueConstraintError){
        return{
          success: false, message:"Le Tarif existe déjà pour cette classe 😴", data:null
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Une valeur référencée (tarif ou classe) n'existe pas", data: null }
      }
=======
      console.error('Erreur détaillée lors de la création:', error)
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      
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

<<<<<<< HEAD
      const result = await Tarif.findAll({
=======
      const tarifs = await Tarif.findAll({
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        include: [
          {
            model: Classe,
            as: 'classe',
            attributes: ['id_classe', 'nom_classe', 'niveau']
          },
          {
<<<<<<< HEAD
=======
            model: AnneeScolaire,
            as: 'anneeScolaire',
            attributes: ['id_annee', 'libelle']
          },
          {
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
            model: TypeFrais,
            as: 'typeFrais',
            attributes: ['id_type_frais', 'libelle', 'detail']
          }
        ],
<<<<<<< HEAD
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
=======
        order: [['anneeScolaire', 'libelle', 'DESC'], ['classe', 'nom_classe', 'ASC'], ['typeFrais', 'libelle', 'ASC']]
      })
      
      return {
        success: true,
        message: 'Tarifs récupérés avec succès',
        data: tarifs
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
=======
            model: AnneeScolaire,
            as: 'anneeScolaire',
            attributes: ['id_annee', 'libelle']
          },
          {
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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

<<<<<<< HEAD
      
=======
      // Vérifier les associations si elles sont fournies
      if (tarifData.id_classe !== undefined) {
        const classe = await Classe.findByPk(tarifData.id_classe)
        if (!classe) {
          return {
            success: false,
            message: 'La classe spécifiée n\'existe pas',
            data: null
          }
        }
      }

      if (tarifData.id_annee !== undefined) {
        const anneeScolaire = await AnneeScolaire.findByPk(tarifData.id_annee)
        if (!anneeScolaire) {
          return {
            success: false,
            message: 'L\'année scolaire spécifiée n\'existe pas',
            data: null
          }
        }
      }

      if (tarifData.id_type_frais !== undefined) {
        const typeFrais = await TypeFrais.findByPk(tarifData.id_type_frais)
        if (!typeFrais) {
          return {
            success: false,
            message: 'Le type de frais spécifié n\'existe pas',
            data: null
          }
        }
      }

      // Vérifier si un tarif existe déjà pour cette nouvelle combinaison
      if (tarifData.id_classe !== undefined || tarifData.id_annee !== undefined || tarifData.id_type_frais !== undefined) {
        const newIdClasse = tarifData.id_classe !== undefined ? tarifData.id_classe : tarif.id_classe
        const newIdAnnee = tarifData.id_annee !== undefined ? tarifData.id_annee : tarif.id_annee
        const newIdTypeFrais = tarifData.id_type_frais !== undefined ? tarifData.id_type_frais : tarif.id_type_frais

        const existingTarif = await Tarif.findOne({
          where: {
            id_classe: newIdClasse,
            id_annee: newIdAnnee,
            id_type_frais: newIdTypeFrais,
            id_tarif: { [sequelize.Sequelize.Op.ne]: id_tarif }
          }
        })

        if (existingTarif) {
          return {
            success: false,
            message: 'Un tarif existe déjà pour cette combinaison classe-année-type de frais',
            data: null
          }
        }
      }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      
      // Mettre à jour le tarif
      await tarif.update(tarifData)
      
      return {
        success: true,
        message: 'Tarif mis à jour avec succès',
        data: tarif.dataValues
      }
    } catch (error) {
<<<<<<< HEAD
      if(error instanceof UniqueConstraintError){
        return{
          success: false, message:"Mise à jour impossible 😴!! Tarif existe déjà pour cette classe ", data:null
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return { success: false, message: "Modification impossible 😴!! (tarif ou classe) n'existe pas", data: null }
      }
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
          message: 'Le tarif est introuvalble 🥱!!',
=======
          message: 'Tarif non trouvé',
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
