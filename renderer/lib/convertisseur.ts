const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('MGA', {
    minimumFractionDigits: 0,
    
  }).format(montant)
}
export const nombre = {
    formatMontant
}