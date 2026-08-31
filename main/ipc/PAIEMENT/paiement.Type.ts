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
<<<<<<< HEAD
}

export type PaiementUpdateType = {
    id_inscription:number;
    id_type_frais?: number;
    montant_paye?: number;
=======
    date_paiement: Date;
}

export type PaiementUpdateType = {
    ref?: string;
    id_inscription?: number;
    id_type_frais?: number;
    montant_paye?: number;
    date_paiement?: Date;
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}
