export type TypeFraisType = {
    id_type_frais: number;
    libelle: string;
    detail: string;
}

export type TypeFraisCreateType = {
    libelle: string;
    detail?: string;
}

export type TypeFraisUpdateType = {
    libelle?: string;
    detail?: string;
}
