// ─── Types retour ─────────────────────────────────────────────────────────────

export type KpiGlobalType = {
  total_inscrits: number
  total_encaisse: number
  total_attendu: number
  taux_recouvrement: number | null
  nb_eleves_a_jour: number
  nb_eleves_en_retard: number
}

export type EffectifsClasseType = {
  id_classe: number
  nom_classe: string
  niveau: string
  titulaire: string
  total: number
  nb_hommes: number
  nb_femmes: number
  pct_hommes: number
  pct_femmes: number
}

export type PaiementParClasseType = {
  id_classe: number
  nom_classe: string
  niveau: string
  nb_inscrits: number
  encaisse: number
  attendu: number
  solde: number
  taux_recouv: number | null
  nb_a_jour: number
  nb_en_retard: number
}

export type PaiementParTypeFraisType = {
  id_type_frais: number
  libelle: string
  freq: number
  nb_paiements: number
  encaisse: number
  attendu: number
  solde: number
  taux_recouv: number | null
  dernier_paiement: string | null
}

export type EleveEnRetardType = {
  id_inscription: number
  id_eleve: number
  matricule: string
  nom_complet: string
  nom_classe: string
  niveau: string
  somme_versee: number
  total_du: number
  ecart: number
}

export type EncaissementMensuelType = {
  mois: string        // 'YYYY-MM'
  nb_paiements: number
  total: number
}

export type DetailPaiementEleveType = {
  id_paiement: number
  ref: string
  libelle_frais: string
  montant_paye: number
  date_paiement: string
}

export type TopClasseRecouvrementType = {
  id_classe: number
  nom_classe: string
  niveau: string
  nb_inscrits: number
  taux_recouv: number | null
  nb_sans_paiement: number
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const api = {

  // KPI de haut niveau pour l'année
  kpiGlobal: async (id_annee: string): Promise<{success: boolean; message: string; data: KpiGlobalType}> => {
    const response = await window.ipc.stats.kpiGlobal(id_annee) as {success: boolean; message: string; data: KpiGlobalType}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Effectifs par classe (total, H, F, %)
  effectifsClasse: async (id_annee: string): Promise<{success: boolean; message: string; data: EffectifsClasseType[]}> => {
    const response = await window.ipc.stats.effectifsClasse(id_annee) as {success: boolean; message: string; data: EffectifsClasseType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Encaissé / attendu / solde / taux par classe
  paiementParClasse: async (id_annee: string): Promise<{success: boolean; message: string; data: PaiementParClasseType[]}> => {
    const response = await window.ipc.stats.paiementParClasse(id_annee) as {success: boolean; message: string; data: PaiementParClasseType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Encaissé / attendu / solde / taux par type de frais
  paiementParTypeFrais: async (id_annee: string): Promise<{success: boolean; message: string; data: PaiementParTypeFraisType[]}> => {
    const response = await window.ipc.stats.paiementParTypeFrais(id_annee) as {success: boolean; message: string; data: PaiementParTypeFraisType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Liste paginée des élèves en retard (filtre classe optionnel)
  elevesEnRetard: async (
    id_annee: string,
    id_classe?: number,
    limit = 80,
    offset = 0
  ): Promise<{success: boolean; message: string; data: EleveEnRetardType[]}> => {
    const response = await window.ipc.stats.elevesEnRetard(id_annee, id_classe, limit, offset) as {success: boolean; message: string; data: EleveEnRetardType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Série mensuelle des encaissements (pour graphiques)
  encaissementMensuel: async (id_annee: string): Promise<{success: boolean; message: string; data: EncaissementMensuelType[]}> => {
    const response = await window.ipc.stats.encaissementMensuel(id_annee) as {success: boolean; message: string; data: EncaissementMensuelType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Détail transaction par transaction d'un élève pour l'année
  detailPaiementsEleve: async (
    id_annee: string,
    id_eleve: number
  ): Promise<{success: boolean; message: string; data: DetailPaiementEleveType[]}> => {
    const response = await window.ipc.stats.detailPaiementsEleve(id_annee, id_eleve) as {success: boolean; message: string; data: DetailPaiementEleveType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },

  // Classement des classes par taux de recouvrement
  topClassesRecouvrement: async (id_annee: string): Promise<{success: boolean; message: string; data: TopClasseRecouvrementType[]}> => {
    const response = await window.ipc.stats.topClassesRecouvrement(id_annee) as {success: boolean; message: string; data: TopClasseRecouvrementType[]}
    if (!response.success) throw new Error(response.message)
    return response
  },
}