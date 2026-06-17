export type TypeFraisType = {
    id_type_frais: number;
    libelle: string;
    detail: string;
    freq: number
}

export type TypeFraisCreateType = {
    libelle: string;
    detail?: string;
    freq: number;
}

export type TypeFraisUpdateType = {
    libelle?: string;
    detail?: string;
    freq?: number;
}
