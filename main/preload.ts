import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'

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
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.userGetAll) as Promise<{success: boolean; message: string; data: any}>,
    getById: (id_user: number) => ipcRenderer.invoke(IPC_CHANNELS.userGetById, id_user) as Promise<{success: boolean; message: string; data: any}>,
    update: (id_user: number, userData: { nom_user?: string; mdp?: string; role?: string }) => ipcRenderer.invoke(IPC_CHANNELS.userUpdate, id_user, userData) as Promise<{success: boolean; message: string; data: any}>,
    delete: (id_user: number) => ipcRenderer.invoke(IPC_CHANNELS.userDelete, id_user) as Promise<{success: boolean; message: string; data: any}>,
    auth: (credentials: { nom_user: string; mdp: string }) => ipcRenderer.invoke(IPC_CHANNELS.userAuth, credentials) as Promise<{success: boolean; message: string; data: any}>,
  },
  database: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.databaseStatus) as Promise<{success: boolean; message: string; initialized: boolean}>,
    reconnect: (fileName: string) => ipcRenderer.invoke(IPC_CHANNELS.dbReconnect, fileName) as Promise<{success: boolean; message: string}>
  },
})

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
