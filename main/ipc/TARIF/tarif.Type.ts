export type TarifType = {
    id_tarif: number;
    id_classe: number;
    id_annee: string;
    id_type_frais: number;
    montant_fixe: number;
}

export type TarifCreateType = {
    id_classe: number;
    id_annee: string;
    id_type_frais: number;
    montant_fixe: number;
}

export type TarifUpdateType = {
    id_classe?: number;
    id_annee?: string;
    id_type_frais?: number;
    montant_fixe?: number;
}
