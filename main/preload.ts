import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'

const handler = Object.freeze({
  hello: {
    getMessage: () => {
      return ipcRenderer.invoke(IPC_CHANNELS.helloGetMessage) as Promise<string>
    },
  },
  file: {
    createText: (fileName: string) => {
      return ipcRenderer.invoke(IPC_CHANNELS.fileCreateText, fileName) as Promise<string>
    },
    listText: () => ipcRenderer.invoke(IPC_CHANNELS.fileListText) as Promise<Array<{name: string; path: string}>>,

  },
})

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
