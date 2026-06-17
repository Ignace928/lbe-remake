import { registerFileController } from './file.controller'
import { registerHelloController } from './hello.controller'
import { registerUserController } from './USER/user.controller'
import { registerAnneeScolaireController } from './ANNESCOLAIRE/anneeScolaire.controller'
import { registerEleveController } from './ELEVE/eleve.controller'
import { registerClasseController } from './CLASSE/classe.controller'
import { registerInscriptionController } from './INSCRIPTION/inscription.controller'
import { registerTypeFraisController } from './FRAIS/typeFrais.controller'
import { registerTarifController } from './TARIF/tarif.controller'
import { registerPaiementController } from './PAIEMENT/paiement.controller'
import { registerDatabaseController } from './database.controller'
import { setGlobalSequelize } from './database'
import { registerStatsController } from './VISUALISATION/stats.controller'

export function registerIpcControllers() {
  registerHelloController()
  registerFileController()
  registerUserController()
  registerAnneeScolaireController()
  registerEleveController()
  registerClasseController()
  registerInscriptionController()
  registerTypeFraisController()
  registerTarifController()
  registerPaiementController()
  registerDatabaseController()
  registerStatsController()
}

export { setGlobalSequelize }
