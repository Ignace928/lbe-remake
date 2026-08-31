import z from "zod";


export const createPaiementSchema = z.object({
    ref: z.string().nonempty("Veuillez entrer un référence unique"),
    id_inscription: z.number("erreur: inscription non mentionné").min(1, "Un Eleve inscrit est requis"),
    id_type_frais: z.number("La raison est requis").min(1, "Veuillez choisir une raison de payement"),
    montant_paye: z.float64("Veuillez entrer un nombre valide")
        .min(1, "Le payement minimum est de 1Ar")
        .max(999999999999999.99, "Montant irréaliste"),
    date_paiement: z.string().optional()
})

export const updatePaiementSchema = createPaiementSchema.partial() 

export type CreatePaiementType = z.infer<typeof createPaiementSchema>
export type UpdatePaiementType = z.infer<typeof updatePaiementSchema>

export const payementByIdSchema = z.object({
    id_paiement: z.number(),
    id_inscription: z.number(),
    ref: z.string(),
    montant_paye: z.float64(),
    date_paiement: z.string(),
    typeFrais: z.object({
        id_type_frais: z.number(),
        libelle: z.string(),
        detail: z.string(),
        freq: z.number(),
    }).optional()
})
export type payementByIdType = z.infer<typeof payementByIdSchema>