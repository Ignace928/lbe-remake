import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'
import { UserType, UserType_noMDP } from './ipc/USER/user.Type'

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
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.eleveGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_eleve: number) => ipcRenderer.invoke(IPC_CHANNELS.eleveGetById, id_eleve) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_eleve: number, eleveData: any) => ipcRenderer.invoke(IPC_CHANNELS.eleveUpdate, id_eleve, eleveData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_eleve: number) => ipcRenderer.invoke(IPC_CHANNELS.eleveDelete, id_eleve) as Promise<{success: boolean; message: string; data: any}>,
  },
})

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
