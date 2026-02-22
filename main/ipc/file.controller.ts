import { app, ipcMain } from 'electron'
import { mkdir, readdir, writeFile } from 'fs/promises'
import path from 'path'
import { IPC_CHANNELS } from './channels'

function sanitizeFileName(rawFileName: string) {
  const trimmed = rawFileName.trim()
  const baseName = trimmed.replace(/\.txt$/i, '')
  const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')

  if (!safeName) {
    throw new Error('Invalid file name')
  }

  return `${safeName}.txt`
}

export function registerFileController() {
  ipcMain.removeHandler(IPC_CHANNELS.fileCreateText)
  ipcMain.handle(IPC_CHANNELS.fileCreateText, async (_event, fileName: string) => {
    const safeFileName = sanitizeFileName(fileName)
    const dataDir = path.join(app.getPath('userData'), 'data')
    const filePath = path.join(dataDir, safeFileName)

    await mkdir(dataDir, { recursive: true })
    await writeFile(filePath, '', 'utf8')

    return filePath
  })


  ipcMain.removeHandler(IPC_CHANNELS.fileListText)
  ipcMain.handle(IPC_CHANNELS.fileListText, async () => {
    const dataDir = path.join(app.getPath('userData'), 'data')
    await mkdir(dataDir, { recursive: true })

    const entries = await readdir(dataDir, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.txt'))
      .map((e) => ({
        name: e.name,
        path: path.join(dataDir, e.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })
}

