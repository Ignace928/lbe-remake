import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { User } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'

export function registerUserController() {
  // CREATE - Créer un utilisateur
  ipcMain.removeHandler(IPC_CHANNELS.userCreate)
  ipcMain.handle(IPC_CHANNELS.userCreate, async (_event, userData: { nom_user: string; mdp: string; role: string }) => {
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
  ipcMain.handle(IPC_CHANNELS.userGetAll, async () => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: []
        }
      }

      const users = await User.findAll({
        attributes: ['id_user', 'nom_user', 'role'], // Exclure le mot de passe
        order: [['nom_user', 'ASC']],
        raw: true // Utiliser raw: true pour obtenir des objets simples
      })
      
      console.log('UserController - users found:', users.length, users)
      
      return {
        success: true,
        message: 'Utilisateurs récupérés avec succès',
        data: users
      }
    } catch (error) {
      console.error('UserController - error:', error)
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  })

  // READ - Obtenir un utilisateur par ID
  ipcMain.removeHandler(IPC_CHANNELS.userGetById)
  ipcMain.handle(IPC_CHANNELS.userGetById, async (_event, id_user: number) => {
    try {
      const sequelize = getGlobalSequelize()
      if (!sequelize) {
        return {
          success: false,
          message: 'Base de données non initialisée',
          data: null
        }
      }

      const user = await User.findByPk(id_user, {
        attributes: ['id_user', 'nom_user', 'role'] // Exclure le mot de passe
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
      
      // Vérifier le mot de passe
      const inputPassword = credentials.mdp ? Buffer.from(credentials.mdp).toString('base64') : ''
      const storedPassword = user.dataValues.mdp || ''
      const isValidPassword = inputPassword === storedPassword
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Nom d\'utilisateur ou mot de passe incorrect',
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
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  })
}
