import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { User } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { UserDataType } from './user.Type'

export function registerUserController() {
  // CREATE - Créer un utilisateur
  ipcMain.removeHandler(IPC_CHANNELS.userCreate)
  ipcMain.handle(IPC_CHANNELS.userCreate, async (_event, userData: UserDataType) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Hasher le mot de passe (simple pour l'instant, à améliorer avec bcrypt plus tard)
      const hashedPassword = Buffer.from(userData.mdp).toString('base64')
      
      // Créer l'utilisateur
      const user = await User.create({
        nom_user: userData.nom_user,
        mdp: hashedPassword,
        role: userData.role,
      })
      
      return {
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id_user: user.dataValues.id_user,
          nom_user: user.dataValues.nom_user,
          role: user.dataValues.role,
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

  // READ - Obtenir tous les utilisateurs
  ipcMain.removeHandler(IPC_CHANNELS.userGetAll)
  ipcMain.handle(IPC_CHANNELS.userGetAll, async (_event, includePasswords: boolean = false) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      // Inclure le mot de passe seulement si includePasswords est true
      const attributes = includePasswords 
        ? ['id_user', 'nom_user', 'role', 'mdp'] 
        : ['id_user', 'nom_user', 'role']

      const users = await User.findAll({
        attributes: attributes,
        order: [['nom_user', 'ASC']],
        raw: true // Utiliser raw: true pour obtenir des objets simples
      })
      
      return {
        success: true,
        message: 'Utilisateurs récupérés avec succès',
        data: users
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un utilisateur par ID
  ipcMain.removeHandler(IPC_CHANNELS.userGetById)
  ipcMain.handle(IPC_CHANNELS.userGetById, async (_event, id_user: number, includePassword: boolean = false) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      // Inclure le mot de passe seulement si includePassword est true
      const attributes = includePassword 
        ? ['id_user', 'nom_user', 'role', 'mdp'] 
        : ['id_user', 'nom_user', 'role']

      const user = await User.findByPk(id_user, {
        attributes: attributes,
        raw: true
      })
      
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Utilisateur récupéré avec succès',
        data: user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })

  // UPDATE - Mettre à jour un utilisateur
  ipcMain.removeHandler(IPC_CHANNELS.userUpdate)
  ipcMain.handle(IPC_CHANNELS.userUpdate, async (_event, id_user: number, userData: { nom_user?: string; mdp?: string; role?: string }) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const user = await User.findByPk(id_user)
      
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
          data: null
        }
      }
      
      // Préparer les données de mise à jour
      const updateData: any = {}
      
      if (userData.nom_user) updateData.nom_user = userData.nom_user
      if (userData.role) updateData.role = userData.role
      if (userData.mdp) updateData.mdp = Buffer.from(userData.mdp).toString('base64')
      
      // Mettre à jour l'utilisateur
      await user.update(updateData)
      
      return {
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: {
          id_user: user.dataValues.id_user,
          nom_user: user.dataValues.nom_user,
          role: user.dataValues.role,
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

  // DELETE - Supprimer un utilisateur
  ipcMain.removeHandler(IPC_CHANNELS.userDelete)
  ipcMain.handle(IPC_CHANNELS.userDelete, async (_event, id_user: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const user = await User.findByPk(id_user)
      
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
          data: null
        }
      }
      
      // Supprimer l'utilisateur
      await user.destroy()
      
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès',
        data: {
          id_user: user.dataValues.id_user,
          nom_user: user.dataValues.nom_user,
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

  // AUTH - Authentifier un utilisateur
  ipcMain.removeHandler(IPC_CHANNELS.userAuth)
  ipcMain.handle(IPC_CHANNELS.userAuth, async (_event, credentials: { nom_user: string; mdp: string }) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const user = await User.findOne({
        where: { nom_user: credentials.nom_user }
      })
      
      if (!user) {
        return {
          success: false,
          message: 'Nom d\'utilisateur ou mot de passe incorrect',
          data: null
        }
      }
      
      // Gérer le mot de passe (vide autorisé pour l'utilisateur par défaut)
      let isValidPassword = false
      const storedPassword = user.dataValues.mdp || ''
      
      if (!credentials.mdp && !storedPassword) {
        // Mot de passe vide des deux côtés (utilisateur par défaut)
        isValidPassword = true
      } else if (credentials.mdp && storedPassword) {
        // Mot de passe fourni des deux côtés
        const inputPassword = Buffer.from(credentials.mdp).toString('base64')
        isValidPassword = inputPassword === storedPassword
      }
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Mot de passe incorrect',
          data: null
        }
      }
      
      return {
        success: true,
        message: 'Authentification réussie',
        data: {
          id_user: user.dataValues.id_user,
          nom_user: user.dataValues.nom_user,
          role: user.dataValues.role,
        }
      }
    } catch (error) {
      console.error('Erreur authentification:', error)
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'authentification',
        data: null
      }
    }
  })
}
