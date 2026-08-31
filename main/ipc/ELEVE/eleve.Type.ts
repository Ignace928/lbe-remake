export type EleveType = {
    id_eleve: number;
<<<<<<< HEAD
    matricule: string;
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
    // matricule: string; // Généré côté backend
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
    matricule?: string; // Géré par le backend lors de la mise à jour
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD

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
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
