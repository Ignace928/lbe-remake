import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'
import { UserType, UserType_noMDP } from './ipc/USER/user.Type'
import { PaiementCreateType } from './ipc/PAIEMENT/paiement.Type'

const handler = Object.freeze({
  hello: {
    getMessage: () => {
      return ipcRenderer.invoke(IPC_CHANNELS.helloGetMessage) as Promise<string>
    },
  },
  file: {
    createDataBase: (fileName: string) => {
      return ipcRenderer.invoke(IPC_CHANNELS.fileCreateDB, fileName) as Promise<string>
    },
    listDataBase: () => ipcRenderer.invoke(IPC_CHANNELS.fileListDB) as Promise<Array<{name: string; path: string}>>,
    dropDataBase: (file_path: string) => ipcRenderer.invoke(IPC_CHANNELS.fileDeleteDB, file_path) as Promise<{success:string, error:string}>,
    getSelectedDB: () => ipcRenderer.invoke(IPC_CHANNELS.fileGetSelectedDB) as Promise<{name: string; path: string; updatedAt: string} | null>,
    setSelectedDB: (data: {name: string; path: string}) => ipcRenderer.invoke(IPC_CHANNELS.fileSetSelectedDB, data) as Promise<{name: string; path: string; updatedAt: string}>,
    clearSelectedDB: () => ipcRenderer.invoke(IPC_CHANNELS.fileClearSelectedDB) as Promise<void>,
    syncDatabase: () => ipcRenderer.invoke(IPC_CHANNELS.dbSync) as Promise<{success: boolean; message: string; database: string | null}>
  },
  user: {
    create: (userData: { nom_user: string; mdp: string; role: string }) => ipcRenderer.invoke(IPC_CHANNELS.userCreate, userData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: (includePasswords: boolean) => ipcRenderer.invoke(IPC_CHANNELS.userGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_user: number, includePassword: boolean) => ipcRenderer.invoke(IPC_CHANNELS.userGetById, id_user) as Promise<{success: boolean; message: string; data: null | UserType | UserType_noMDP}>,
    update: (id_user: number, userData: { nom_user?: string; mdp?: string; role?: string }) => ipcRenderer.invoke(IPC_CHANNELS.userUpdate, id_user, userData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_user: number) => ipcRenderer.invoke(IPC_CHANNELS.userDelete, id_user) as Promise<{success: boolean; message: string; data: any}>,
    auth: (credentials: { nom_user: string; mdp: string }) => ipcRenderer.invoke(IPC_CHANNELS.userAuth, credentials) as Promise<{success: boolean; message: string; data: any}>,
  },
  database: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.databaseStatus) as Promise<{success: boolean; message: string; initialized: boolean}>,
    reconnect: (fileName: string) => ipcRenderer.invoke(IPC_CHANNELS.dbReconnect, fileName) as Promise<{success: boolean; message: string}>
  },
  anneeScolaire: {
    create: (anneeData: { libelle: string }) => ipcRenderer.invoke(IPC_CHANNELS.anneeScolaireCreate, anneeData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.anneeScolaireGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_annee: string) => ipcRenderer.invoke(IPC_CHANNELS.anneeScolaireGetById, id_annee) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_annee: string, anneeData: { libelle?: string }) => ipcRenderer.invoke(IPC_CHANNELS.anneeScolaireUpdate, id_annee, anneeData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_annee: string) => ipcRenderer.invoke(IPC_CHANNELS.anneeScolaireDelete, id_annee) as Promise<{success: boolean; message: string; data: any}>,
  },
  eleve: {
    create: (eleveData: any) => ipcRenderer.invoke(IPC_CHANNELS.eleveCreate, eleveData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: (params?: any) => ipcRenderer.invoke(IPC_CHANNELS.eleveGetAll, params) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_eleve: number) => ipcRenderer.invoke(IPC_CHANNELS.eleveGetById, id_eleve) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_eleve: number, eleveData: any) => ipcRenderer.invoke(IPC_CHANNELS.eleveUpdate, id_eleve, eleveData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_eleve: number) => ipcRenderer.invoke(IPC_CHANNELS.eleveDelete, id_eleve) as Promise<{success: boolean; message: string; data: any}>,
  },
  classe: {
    create: (classeData: any) => ipcRenderer.invoke(IPC_CHANNELS.classeCreate, classeData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.classeGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_classe: number) => ipcRenderer.invoke(IPC_CHANNELS.classeGetById, id_classe) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_classe: number, classeData: any) => ipcRenderer.invoke(IPC_CHANNELS.classeUpdate, id_classe, classeData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_classe: number) => ipcRenderer.invoke(IPC_CHANNELS.classeDelete, id_classe) as Promise<{success: boolean; message: string; data: any}>,
  },
  inscription: {
    create: (inscriptionData: any) => ipcRenderer.invoke(IPC_CHANNELS.inscriptionCreate, inscriptionData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.inscriptionGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getAllThisYear: (params?:any) => ipcRenderer.invoke(IPC_CHANNELS.inscriptionGetAllThisYear, params) as Promise<{success: boolean; message: string; data: any}>,
    getById: (params?:any) => ipcRenderer.invoke(IPC_CHANNELS.inscriptionGetById, params) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_inscription: number, inscriptionData: any) => ipcRenderer.invoke(IPC_CHANNELS.inscriptionUpdate, id_inscription, inscriptionData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_inscription: number) => ipcRenderer.invoke(IPC_CHANNELS.inscriptionDelete, id_inscription) as Promise<{success: boolean; message: string; data: any}>,
  },
  typeFrais: {
    create: (typeFraisData: any) => ipcRenderer.invoke(IPC_CHANNELS.typeFraisCreate, typeFraisData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.typeFraisGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_type_frais: number) => ipcRenderer.invoke(IPC_CHANNELS.typeFraisGetById, id_type_frais) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_type_frais: number, typeFraisData: any) => ipcRenderer.invoke(IPC_CHANNELS.typeFraisUpdate, id_type_frais, typeFraisData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_type_frais: number) => ipcRenderer.invoke(IPC_CHANNELS.typeFraisDelete, id_type_frais) as Promise<{success: boolean; message: string; data: any}>,
  },
  tarif: {
    create: (tarifData: any) => ipcRenderer.invoke(IPC_CHANNELS.tarifCreate, tarifData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.tarifGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_tarif: number) => ipcRenderer.invoke(IPC_CHANNELS.tarifGetById, id_tarif) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_tarif: number, tarifData: any) => ipcRenderer.invoke(IPC_CHANNELS.tarifUpdate, id_tarif, tarifData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_tarif: number) => ipcRenderer.invoke(IPC_CHANNELS.tarifDelete, id_tarif) as Promise<{success: boolean; message: string; data: any}>,
  },
  paiement: {
    create: (paiementData: PaiementCreateType) => ipcRenderer.invoke(IPC_CHANNELS.paiementCreate, paiementData) as Promise<{success: boolean; message: string; data: any}>,
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.paiementGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (params: {id_inscription:number}) => ipcRenderer.invoke(IPC_CHANNELS.paiementGetById, params) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_paiement: number, paiementData: any) => ipcRenderer.invoke(IPC_CHANNELS.paiementUpdate, id_paiement, paiementData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_paiement: number) => ipcRenderer.invoke(IPC_CHANNELS.paiementDelete, id_paiement) as Promise<{success: boolean; message: string; data: any}>,
  },
  stats: {
    kpiGlobal: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsKpiGlobal, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,

    effectifsClasse: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsEffectifsClasse, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,

    paiementParClasse: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsPaiementParClasse, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,

    paiementParTypeFrais: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsPaiementParTypeFrais, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,

    elevesEnRetard: (id_annee: string, id_classe?: number, limit?: number, offset?: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsElevesEnRetard, { id_annee, id_classe, limit, offset }) as Promise<{success: boolean; message: string; data: any}>,

    encaissementMensuel: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsEncaissementMensuel, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,

    detailPaiementsEleve: (id_annee: string, id_eleve: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsDetailPaiementsEleve, { id_annee, id_eleve }) as Promise<{success: boolean; message: string; data: any}>,

    topClassesRecouvrement: (id_annee: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.statsTopClassesRecouvrement, { id_annee }) as Promise<{success: boolean; message: string; data: any}>,
  },
})

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
