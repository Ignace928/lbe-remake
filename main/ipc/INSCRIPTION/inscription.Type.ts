export type InscriptionType = {
    id_inscription: number;
    id_classe: number;
    id_eleve: number;
    id_annee: string;
<<<<<<< HEAD
    somme: number;
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    passant: boolean;
}

export type InscriptionCreateType = {
    id_classe: number;
    id_eleve: number;
    id_annee: string;
<<<<<<< HEAD
    somme: number;
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    passant?: boolean;
}

export type InscriptionUpdateType = {
    id_classe?: number;
    id_eleve?: number;
    id_annee?: string;
<<<<<<< HEAD
    somme?: number;
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    passant?: boolean;
}
