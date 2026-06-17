export type EleveType = {
    id_eleve: number;
    matricule: string;
    nom_eleve: string;
    post_nom_eleve?: string;
    sexe: 'M' | 'F';
    date_naissance: string;
    lieu_naissance?: string;
    nationalite?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    nom_pere?: string;
    nom_mere?: string;
    profession_pere?: string;
    profession_mere?: string;
    etat: 'Actif' | 'Inactif';
    maladie?: string;
    taille: number;
    created_at: Date;
}

export type EleveCreateType = {
    id_eleve?: number; // Optionnel, seulement si la table est vide
    // matricule: string; // Généré côté backend
    nom_eleve: string;
    post_nom_eleve?: string;
    sexe: 'M' | 'F';
    date_naissance: string;
    lieu_naissance?: string;
    nationalite?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    nom_pere?: string;
    nom_mere?: string;
    profession_pere?: string;
    profession_mere?: string;
    etat?: 'Actif' | 'Inactif';
    maladie?: string;
    taille?: number;
}

export type EleveUpdateType = {
    matricule?: string; // Géré par le backend lors de la mise à jour
    nom_eleve?: string;
    post_nom_eleve?: string;
    sexe?: 'M' | 'F';
    date_naissance?: string;
    lieu_naissance?: string;
    nationalite?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    nom_pere?: string;
    nom_mere?: string;
    profession_pere?: string;
    profession_mere?: string;
    etat?: 'Actif' | 'Inactif';
    maladie?: string;
    taille?: number;
}

// Types pour la réponse avec pagination optimisée
export type EleveGetAllParams = {
    cursor?: number;
    limit?: number;
}

export type EleveGetAllResponse = {
    success: boolean;
    message: string;
    data: {
        rows: EleveType[];
        pagination: {
            cursor: number;
            hasMore: boolean;
            totalCount: number;
            currentBatchSize: number;
            limit: number;
        };
    };
}
