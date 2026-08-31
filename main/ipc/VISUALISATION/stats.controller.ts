import { ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'
import { IPC_CHANNELS } from '../channels'
import { getGlobalSequelize } from '../database'

// ─── Helpers réponse (même pattern que paiement.controller.ts) ───────────────

function ok<T>(message: string, data: T) {
  return { success: true, message, data }
}
function fail(message: string) {
  return { success: false, message, data: null }
}

// ─── Controller ──────────────────────────────────────────────────────────────

export function registerStatsController() {

  // ── KPI GLOBAUX ───────────────────────────────────────────────────────────
  // total inscrits · encaissé · attendu · taux recouvrement · à jour / en retard
  ipcMain.removeHandler(IPC_CHANNELS.statsKpiGlobal)
  ipcMain.handle(
    IPC_CHANNELS.statsKpiGlobal,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const [row] = await seq.query(
          `WITH ins AS (
            SELECT i.somme,
                   COALESCE(att.du, 0) AS du
            FROM   INSCRIPTIONS i
            LEFT JOIN (
              SELECT t.id_classe, SUM(t.montant_fixe * tf.freq) AS du
              FROM   TARIFS t
              JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
              GROUP  BY t.id_classe
            ) att ON att.id_classe = i.id_classe
            WHERE  i.id_annee = :id_annee
          )
          SELECT
            COUNT(*)                                        AS total_inscrits,
            COALESCE(SUM(somme), 0)                        AS total_encaisse,
            COALESCE(SUM(du), 0)                           AS total_attendu,
            CASE WHEN SUM(du) > 0
                 THEN ROUND(SUM(somme) * 100.0 / SUM(du), 2)
                 ELSE NULL END                             AS taux_recouvrement,
            SUM(CASE WHEN somme >= du THEN 1 ELSE 0 END)  AS nb_eleves_a_jour,
            SUM(CASE WHEN somme <  du THEN 1 ELSE 0 END)  AS nb_eleves_en_retard
          FROM ins`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('KPI globaux récupérés', row)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── EFFECTIFS PAR CLASSE ──────────────────────────────────────────────────
  // effectif total · nb hommes · nb femmes · pourcentages
  ipcMain.removeHandler(IPC_CHANNELS.statsEffectifsClasse)
  ipcMain.handle(
    IPC_CHANNELS.statsEffectifsClasse,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `SELECT
            c.id_classe,
            c.nom_classe,
            c.niveau,
            c.titulaire,
            COUNT(i.id_inscription)                              AS total,
            SUM(CASE WHEN e.sexe = 'M' THEN 1 ELSE 0 END)      AS nb_hommes,
            SUM(CASE WHEN e.sexe = 'F' THEN 1 ELSE 0 END)      AS nb_femmes,
            ROUND(SUM(CASE WHEN e.sexe = 'M' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS pct_hommes,
            ROUND(SUM(CASE WHEN e.sexe = 'F' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS pct_femmes
          FROM   INSCRIPTIONS i
          JOIN   CLASSES c ON c.id_classe = i.id_classe
          JOIN   ELEVES  e ON e.id_eleve  = i.id_eleve
          WHERE  i.id_annee = :id_annee
          GROUP  BY c.id_classe, c.nom_classe, c.niveau
          ORDER  BY c.niveau, c.nom_classe`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('Effectifs par classe récupérés', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── PAIEMENTS PAR CLASSE ──────────────────────────────────────────────────
  // encaissé · attendu · solde · taux · nb à jour / en retard
  ipcMain.removeHandler(IPC_CHANNELS.statsPaiementParClasse)
  ipcMain.handle(
    IPC_CHANNELS.statsPaiementParClasse,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `WITH
            ins AS (
              SELECT i.id_classe,
                     COUNT(*)                                             AS nb_inscrits,
                     SUM(i.somme)                                         AS encaisse,
                     SUM(CASE WHEN i.somme >= COALESCE(att.du,0) THEN 1 ELSE 0 END) AS nb_a_jour,
                     SUM(CASE WHEN i.somme <  COALESCE(att.du,0) THEN 1 ELSE 0 END) AS nb_en_retard
              FROM   INSCRIPTIONS i
              LEFT JOIN (
                SELECT t.id_classe, SUM(t.montant_fixe * tf.freq) AS du
                FROM   TARIFS t
                JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
                GROUP  BY t.id_classe
              ) att ON att.id_classe = i.id_classe
              WHERE  i.id_annee = :id_annee
              GROUP  BY i.id_classe
            ),
            tc AS (
              SELECT t.id_classe, SUM(t.montant_fixe * tf.freq) AS du_par_eleve
              FROM   TARIFS t
              JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
              GROUP  BY t.id_classe
            )
          SELECT
            c.id_classe,
            c.nom_classe,
            c.niveau,
            ins.nb_inscrits,
            COALESCE(ins.encaisse, 0)                               AS encaisse,
            COALESCE(tc.du_par_eleve, 0) * ins.nb_inscrits         AS attendu,
            (COALESCE(tc.du_par_eleve, 0) * ins.nb_inscrits)
              - COALESCE(ins.encaisse, 0)                          AS solde,
            CASE WHEN COALESCE(tc.du_par_eleve, 0) * ins.nb_inscrits > 0
                 THEN ROUND(ins.encaisse * 100.0 / (tc.du_par_eleve * ins.nb_inscrits), 2)
                 ELSE NULL END                                      AS taux_recouv,
            ins.nb_a_jour,
            ins.nb_en_retard
          FROM   ins
          JOIN   CLASSES c       ON c.id_classe  = ins.id_classe
          LEFT JOIN tc           ON tc.id_classe = ins.id_classe
          ORDER  BY c.niveau, c.nom_classe`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('Paiements par classe récupérés', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── PAIEMENTS PAR TYPE DE FRAIS ───────────────────────────────────────────
  // nb paiements · encaissé · attendu · solde · taux · date dernier paiement
  ipcMain.removeHandler(IPC_CHANNELS.statsPaiementParTypeFrais)
  ipcMain.handle(
    IPC_CHANNELS.statsPaiementParTypeFrais,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `WITH
            pmt AS (
              SELECT p.id_type_frais,
                     COUNT(p.id_paiement)  AS nb_paiements,
                     SUM(p.montant_paye)   AS encaisse,
                     MAX(p.date_paiement)  AS dernier_paiement
              FROM   PAIEMENTS p
              JOIN   INSCRIPTIONS i ON i.id_inscription = p.id_inscription
              WHERE  i.id_annee = :id_annee
              GROUP  BY p.id_type_frais
            ),
            attendu AS (
              SELECT t.id_type_frais,
                     SUM(t.montant_fixe * tf.freq * nb.cnt) AS attendu
              FROM   TARIFS t
              JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
              JOIN (
                SELECT id_classe, COUNT(*) AS cnt
                FROM   INSCRIPTIONS
                WHERE  id_annee = :id_annee
                GROUP  BY id_classe
              ) nb ON nb.id_classe = t.id_classe
              GROUP  BY t.id_type_frais
            )
          SELECT
            tf.id_type_frais,
            tf.libelle,
            tf.freq,
            COALESCE(p.nb_paiements, 0)          AS nb_paiements,
            COALESCE(p.encaisse, 0)              AS encaisse,
            COALESCE(a.attendu, 0)               AS attendu,
            COALESCE(a.attendu, 0)
              - COALESCE(p.encaisse, 0)          AS solde,
            CASE WHEN COALESCE(a.attendu, 0) > 0
                 THEN ROUND(COALESCE(p.encaisse,0) * 100.0 / a.attendu, 2)
                 ELSE NULL END                   AS taux_recouv,
            p.dernier_paiement
          FROM   TYPEFRAIS tf
          LEFT JOIN pmt     p ON p.id_type_frais = tf.id_type_frais
          LEFT JOIN attendu a ON a.id_type_frais = tf.id_type_frais
          WHERE  a.attendu IS NOT NULL OR p.encaisse IS NOT NULL
          ORDER  BY tf.libelle`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('Paiements par type de frais récupérés', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── ÉLÈVES EN RETARD (paginé, filtre classe optionnel) ────────────────────
  ipcMain.removeHandler(IPC_CHANNELS.statsElevesEnRetard)
  ipcMain.handle(
    IPC_CHANNELS.statsElevesEnRetard,
    async (
      _e,
      { id_annee, id_classe, limit = 50, offset = 0 }:
      { id_annee: string; id_classe?: number; limit?: number; offset?: number }
    ) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const classeFilter = id_classe ? 'AND i.id_classe = :id_classe' : ''
        const rows = await seq.query(
          `WITH tpc AS (
            SELECT t.id_classe, SUM(t.montant_fixe * tf.freq) AS total_du
            FROM   TARIFS t
            JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
            GROUP  BY t.id_classe
          )
          SELECT
            i.id_inscription,
            e.id_eleve,
            e.matricule,
            e.nom_eleve || ' ' || COALESCE(e.post_nom_eleve, '') AS nom_complet,
            c.nom_classe,
            c.niveau,
            i.somme                       AS somme_versee,
            COALESCE(tpc.total_du, 0)     AS total_du,
            COALESCE(tpc.total_du, 0) - i.somme AS ecart
          FROM   INSCRIPTIONS i
          JOIN   ELEVES  e   ON e.id_eleve  = i.id_eleve
          JOIN   CLASSES c   ON c.id_classe = i.id_classe
          LEFT JOIN tpc      ON tpc.id_classe = i.id_classe
          WHERE  i.id_annee = :id_annee
            AND  i.somme < COALESCE(tpc.total_du, 0)
            ${classeFilter}
          ORDER  BY ecart DESC, e.nom_eleve
          LIMIT  :limit OFFSET :offset`,
          {
            replacements: { id_annee, id_classe: id_classe ?? null, limit, offset },
            type: QueryTypes.SELECT,
          }
        )
        return ok('Élèves en retard récupérés', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── ENCAISSEMENTS MENSUELS ────────────────────────────────────────────────
  // série { mois: 'YYYY-MM', nb_paiements, total } pour graphiques
  ipcMain.removeHandler(IPC_CHANNELS.statsEncaissementMensuel)
  ipcMain.handle(
    IPC_CHANNELS.statsEncaissementMensuel,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `SELECT
            strftime('%Y-%m', p.date_paiement) AS mois,
            COUNT(p.id_paiement)               AS nb_paiements,
            SUM(p.montant_paye)                AS total
          FROM   PAIEMENTS p
          JOIN   INSCRIPTIONS i ON i.id_inscription = p.id_inscription
          WHERE  i.id_annee = :id_annee
          GROUP  BY mois
          ORDER  BY mois`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('Encaissements mensuels récupérés', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── DÉTAIL PAIEMENTS D'UN ÉLÈVE ───────────────────────────────────────────
  // drill-through depuis la liste des retardataires
  ipcMain.removeHandler(IPC_CHANNELS.statsDetailPaiementsEleve)
  ipcMain.handle(
    IPC_CHANNELS.statsDetailPaiementsEleve,
    async (_e, { id_annee, id_eleve }: { id_annee: string; id_eleve: number }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `SELECT
            p.id_paiement,
            p.ref,
            tf.libelle  AS libelle_frais,
            p.montant_paye,
            p.date_paiement
          FROM   PAIEMENTS p
          JOIN   INSCRIPTIONS i  ON i.id_inscription = p.id_inscription
          JOIN   TYPEFRAIS    tf ON tf.id_type_frais  = p.id_type_frais
          WHERE  i.id_annee = :id_annee
            AND  i.id_eleve = :id_eleve
          ORDER  BY p.date_paiement DESC`,
          { replacements: { id_annee, id_eleve }, type: QueryTypes.SELECT }
        )
        return ok('Détail paiements élève récupéré', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )

  // ── TOP CLASSES PAR TAUX DE RECOUVREMENT ──────────────────────────────────
  // classement + nb élèves sans aucun paiement
  ipcMain.removeHandler(IPC_CHANNELS.statsTopClassesRecouvrement)
  ipcMain.handle(
    IPC_CHANNELS.statsTopClassesRecouvrement,
    async (_e, { id_annee }: { id_annee: string }) => {
      const seq = getGlobalSequelize()
      if (!seq) return fail('Base non initialisée')
      try {
        const rows = await seq.query(
          `WITH ins AS (
            SELECT i.id_classe,
                   i.id_inscription,
                   i.somme,
                   COALESCE(tpc.du, 0) AS du
            FROM   INSCRIPTIONS i
            LEFT JOIN (
              SELECT t.id_classe, SUM(t.montant_fixe * tf.freq) AS du
              FROM   TARIFS t
              JOIN   TYPEFRAIS tf ON tf.id_type_frais = t.id_type_frais
              GROUP  BY t.id_classe
            ) tpc ON tpc.id_classe = i.id_classe
            WHERE  i.id_annee = :id_annee
          )
          SELECT
            c.id_classe,
            c.nom_classe,
            c.niveau,
            COUNT(ins.id_inscription)                       AS nb_inscrits,
            CASE WHEN SUM(ins.du) > 0
                 THEN ROUND(SUM(ins.somme) * 100.0 / SUM(ins.du), 2)
                 ELSE NULL END                              AS taux_recouv,
            SUM(CASE WHEN ins.somme = 0 THEN 1 ELSE 0 END) AS nb_sans_paiement
          FROM   ins
          JOIN   CLASSES c ON c.id_classe = ins.id_classe
          GROUP  BY c.id_classe, c.nom_classe, c.niveau
          ORDER  BY taux_recouv DESC`,
          { replacements: { id_annee }, type: QueryTypes.SELECT }
        )
        return ok('Classement recouvrement récupéré', rows)
      } catch (e) {
        return fail((e as Error).message)
      }
    }
  )
}