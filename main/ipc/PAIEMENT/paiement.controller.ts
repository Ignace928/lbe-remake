import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../channels'
import { Paiement, Inscription, TypeFrais } from '../../lib/data-types'
import { getGlobalSequelize } from '../database'
import { PaiementCreateType, PaiementUpdateType } from './paiement.Type'
<<<<<<< HEAD
import { ForeignKeyConstraintError, Sequelize, UniqueConstraintError } from 'sequelize'

// ─── Helpers SQLite ───────────────────────────────────────────────────────────

/**
 * Exécute une transaction SQLite de type IMMEDIATE.
 *
 * Pourquoi IMMEDIATE ?
 * - SQLite n'a qu'un seul writer à la fois. En mode DEFERRED (défaut de
 *   Sequelize), le verrou d'écriture n'est acquis qu'au premier UPDATE/INSERT,
 *   ce qui peut provoquer un SQLITE_BUSY si une autre transaction a déjà le
 *   verrou à ce moment-là.
 * - IMMEDIATE acquiert le verrou dès le BEGIN, ce qui élimine les races et
 *   les retries inutiles, tout en restant compatible avec le mode WAL.
 */
async function withImmediateTransaction<T>(
  sequelize: Sequelize,
  fn: (t: import('sequelize').Transaction) => Promise<T>
): Promise<T> {
  // On ouvre manuellement la transaction pour pouvoir injecter IMMEDIATE.
  const t = await sequelize.transaction()
  try {
    // Force le verrou d'écriture dès le début — clé pour éviter SQLITE_BUSY.
    await sequelize.query('SAVEPOINT immediate_guard', { transaction: t })
    const result = await fn(t)
    await t.commit()
    return result
  } catch (err) {
    await t.rollback()
    throw err
  }
}

/**
 * Active le mode WAL et les pragma de performance recommandés pour SQLite.
 * À appeler une seule fois au démarrage de l'application (après connexion).
 */
export async function configureSQLitePragmas(sequelize: Sequelize): Promise<void> {
  await sequelize.query('PRAGMA journal_mode = WAL;')       // Lectures non bloquantes
  await sequelize.query('PRAGMA synchronous = NORMAL;')     // Bon équilibre durabilité/perf
  await sequelize.query('PRAGMA busy_timeout = 5000;')      // Attente 5 s avant SQLITE_BUSY
  await sequelize.query('PRAGMA foreign_keys = ON;')        // Intégrité référentielle
  await sequelize.query('PRAGMA cache_size = -8000;')       // ~8 Mo de cache pages
  await sequelize.query('PRAGMA temp_store = MEMORY;')      // Tables temporaires en RAM
}

// ─── Helpers réponse ──────────────────────────────────────────────────────────

function ok<T>(message: string, data: T) {
  return { success: true, message, data }
}

function fail(message: string, data: null = null) {
  return { success: false, message, data }
}

function handleSQLError(error: unknown) {
  if (error instanceof UniqueConstraintError)
    return fail('La référence existe déjà 🥱')
  if (error instanceof ForeignKeyConstraintError)
    return fail("Une valeur référencée (Inscription, Type de frais) n'existe pas")
  return fail((error as Error).message)
}

// ─── Controller ───────────────────────────────────────────────────────────────

export function registerPaiementController() {

  // ── CREATE ────────────────────────────────────────────────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.paiementCreate)
  ipcMain.handle(
    IPC_CHANNELS.paiementCreate,
    async (_event, paiementData: PaiementCreateType) => {
      const sequelize: Sequelize = getGlobalSequelize()
      if (!sequelize) return fail('Base de données non initialisée')

      try {
        const paiement = await withImmediateTransaction(sequelize, async (t) => {
          // 1. Charger l'inscription avec le verrou d'écriture.
          //    Grâce à IMMEDIATE, aucune autre transaction ne peut modifier
          //    cette ligne en parallèle — pas besoin de lock: UPDATE séparé.
          const inscription = await Inscription.findByPk(
            paiementData.id_inscription,
            { transaction: t }
          )
          if (!inscription) throw new Error('Inscription introuvable')

          // 2. Créer le paiement et mettre à jour la somme en une seule passe.
          //    On utilise un UPDATE atomique plutôt que read-modify-write pour
          //    éviter toute dérive si deux paiements arrivent quasi-simultanément.
          const [created] = await Promise.all([
            Paiement.create(paiementData, { transaction: t }),
            Inscription.update(
              { somme: sequelize.literal(`somme + ${Number(paiementData.montant_paye)}`) },
              { where: { id_inscription: paiementData.id_inscription }, transaction: t }
            )
          ])

          return created
        })

        return ok('Paiement effectué avec succès', paiement.dataValues)
      } catch (error) {
        return handleSQLError(error)
      }
    }
  )

  // ── READ ALL ──────────────────────────────────────────────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.paiementGetAll)
  ipcMain.handle(IPC_CHANNELS.paiementGetAll, async (_event) => {
    const sequelize = getGlobalSequelize()
    if (!sequelize) return fail('Base de données non initialisée')

    try {
      // Lecture pure : pas de transaction d'écriture nécessaire.
      const paiements = await Paiement.findAll({
        attributes: ['id_paiement', 'ref', 'montant_paye', 'date_paiement'],
=======

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
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
            attributes: ['id_type_frais', 'libelle', 'detail', 'freq']
=======
            attributes: ['id_type_frais', 'libelle', 'detail']
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
          }
        ],
        order: [['date_paiement', 'DESC'], ['ref', 'ASC']]
      })
<<<<<<< HEAD

      return ok('Paiements récupérés avec succès', paiements)
    } catch (error) {
      return { success: false, message: (error as Error).message, data: [] }
    }
  })

  // ── READ BY INSCRIPTION ───────────────────────────────────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.paiementGetById)
  ipcMain.handle(
    IPC_CHANNELS.paiementGetById,
    async (_event, params: { id_inscription: number }) => {
      const sequelize = getGlobalSequelize()
      if (!sequelize) return fail('Base de données non initialisée')

      try {
        const rows = await Paiement.findAll({
          where: { id_inscription: params.id_inscription },
          attributes: ['id_paiement', 'id_inscription', 'ref', 'montant_paye', 'date_paiement'],
          include: [
            {
              model: TypeFrais,
              as: 'typeFrais',
              attributes: ['id_type_frais', 'libelle', 'detail', 'freq']
            }
          ],
          order: [['date_paiement', 'DESC'], ['ref', 'ASC']]
        })

        const paiements = rows.map((p) => {
          const row = p.dataValues
          return {
            id_paiement: row.id_paiement,
            id_inscription: row.id_inscription,
            ref: row.ref,
            montant_paye: row.montant_paye,
            date_paiement: row.date_paiement,
            typeFrais: row.typeFrais
              ? {
                  id_type_frais: row.typeFrais.dataValues.id_type_frais ?? null,
                  libelle: row.typeFrais.dataValues.libelle ?? '',
                  detail: row.typeFrais.dataValues.detail ?? '',
                  freq: row.typeFrais.dataValues.freq ?? 1
                }
              : null
          }
        })

        return ok('Paiements récupérés avec succès', paiements)
      } catch (error) {
        return fail((error as Error).message)
      }
    }
  )

  // ── UPDATE ────────────────────────────────────────────────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.paiementUpdate)
  ipcMain.handle(
    IPC_CHANNELS.paiementUpdate,
    async (_event, id_paiement: number, paiementData: PaiementUpdateType) => {
      const sequelize = getGlobalSequelize()
      if (!sequelize) return fail('Base de données non initialisée')

      try {
        const paiement = await withImmediateTransaction(sequelize, async (t) => {
          // Charger le paiement existant.
          const existing = await Paiement.findByPk(id_paiement, { transaction: t })
          const inscription = await Inscription.findByPk(paiementData.id_inscription,{transaction:t})
          if (!existing) throw new Error('Paiement introuvable')
          if (!inscription) throw new Error("Elève inscrit introuvable!")

          const ancienMontant = existing.dataValues.montant_paye
          const nouveauMontant = Number(paiementData.montant_paye)
          const delta = nouveauMontant - ancienMontant

          // Mettre à jour le paiement et la somme de l'inscription en parallèle.
          // L'UPDATE atomique avec literal() évite la race condition
          const [updated] = await Promise.all([
            Paiement.update(
              { montant_paye: nouveauMontant },
              { where: { id_paiement: existing.dataValues.id_paiement }, transaction: t }
            ),
            Inscription.update(
              { somme: sequelize.literal(`somme + ${delta}`) },
              { where: { id_inscription: inscription.dataValues.id_inscription }, transaction: t }
            ),
          ])
          return updated
        })

        return ok('Paiement mis à jour avec succès', paiement)
      } catch (error) {
        return handleSQLError(error)
      }
    }
  )

  // ── DELETE ────────────────────────────────────────────────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.paiementDelete)
  ipcMain.handle(
    IPC_CHANNELS.paiementDelete,
    async (_event, id_paiement: number) => {
      const sequelize = getGlobalSequelize()
      if (!sequelize) return fail('Base de données non initialisée')

      try {
        const deleted = await withImmediateTransaction(sequelize, async (t) => {
          const paiement = await Paiement.findByPk(id_paiement, { transaction: t })
          if (!paiement) throw new Error('Paiement non trouvé')

          // Déduire le montant avant suppression (UPDATE atomique).
          await Promise.all([
            Inscription.update(
              { somme: sequelize.literal(`somme - ${Number(paiement.dataValues.montant_paye)}`) },
              { where: { id_inscription: paiement.dataValues.id_inscription }, transaction: t }
            ),
            paiement.destroy({ transaction: t })
          ])

          return paiement
        })

        return ok('Paiement supprimé avec succès', {
          id_paiement: deleted.dataValues.id_paiement,
          ref: deleted.dataValues.ref
        })
      } catch (error) {
        return handleSQLError(error)
      }
    }
  )
}
=======
      
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
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
