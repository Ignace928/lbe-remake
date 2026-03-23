export type ClasseType = {
    id_classe: number;
    nom_classe: string;
    niveau: string;
    delegue_1: number | null;
    delegue_2: number | null;
    meilleur_eleve: number | null;
    titulaire: string | null;
}

export type ClasseCreateType = {
    nom_classe: string;
    niveau: string;
    delegue_1?: number | null;
    delegue_2?: number | null;
    meilleur_eleve?: number | null;
    titulaire?: string | null;
}

export type ClasseUpdateType = {
    nom_classe?: string;
    niveau?: string;
    delegue_1?: number | null;
    delegue_2?: number | null;
    meilleur_eleve?: number | null;
    titulaire?: string | null;
}
