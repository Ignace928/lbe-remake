export type PaiementType = {
    id_paiement: number;
    ref: string;
    id_inscription: number;
    id_type_frais: number;
    montant_paye: number;
    date_paiement: Date;
}

export type PaiementCreateType = {
    ref: string;
    id_inscription: number;
    id_type_frais: number;
    montant_paye: number;
}

export type PaiementUpdateType = {
    id_inscription:number;
    id_type_frais?: number;
    montant_paye?: number;
}
