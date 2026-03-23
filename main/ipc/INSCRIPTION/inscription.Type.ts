export type InscriptionType = {
    id_inscription: number;
    id_classe: number;
    id_eleve: number;
    id_annee: string;
    passant: boolean;
}

export type InscriptionCreateType = {
    id_classe: number;
    id_eleve: number;
    id_annee: string;
    passant?: boolean;
}

export type InscriptionUpdateType = {
    id_classe?: number;
    id_eleve?: number;
    id_annee?: string;
    passant?: boolean;
}
