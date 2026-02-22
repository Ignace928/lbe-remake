import { ipcMain } from 'electron'
import { IPC_CHANNELS } from './channels'

const HELLO_MESSAGE = 'Hello World from main process'

export function registerHelloController() {
  ipcMain.removeHandler(IPC_CHANNELS.helloGetMessage)
  ipcMain.handle(IPC_CHANNELS.helloGetMessage, async () => HELLO_MESSAGE)
}

