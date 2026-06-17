import { app } from 'electron'
import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises'
import path from 'path'

export type SelectedDb = {
  name: string
  path: string
  updatedAt: string
}

function getSelectedDbFilePath() {
  return path.join(app.getPath('userData'), 'data', 'selected-db.json')
}

export async function readSelectedDb(): Promise<SelectedDb | null> {
  try {
    const raw = await readFile(getSelectedDbFilePath(), 'utf8')
    const parsed = JSON.parse(raw) as SelectedDb

    if (!parsed?.path || !parsed?.name) {
      return null
    }

    await stat(parsed.path)
    return parsed
  } catch {
    return null
  }
}

export async function writeSelectedDb(entry: { name: string; path: string }) {
  const selected: SelectedDb = {
    name: entry.name,
    path: entry.path,
    updatedAt: new Date().toISOString(),
  }

  const filePath = getSelectedDbFilePath()
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(selected, null, 2), 'utf8')

  return selected
}

export async function clearSelectedDb() {
  try {
    await unlink(getSelectedDbFilePath())
  } catch {
    // ignore missing file
  }
}
