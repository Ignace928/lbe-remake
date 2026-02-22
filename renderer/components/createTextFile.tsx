import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

type TextFileEntry = {
  name: string
  path: string
}

export function CreateTextFileComponent() {
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListing, setIsListing] = useState(false)
  const [resultPath, setResultPath] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [files, setFiles] = useState<TextFileEntry[]>([])

  const loadFiles = async () => {
    setIsListing(true)
    setErrorMessage('')
    try {
      const listedFiles = await window.ipc.file.listText()
      console.log(listedFiles)
      setFiles(listedFiles)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsListing(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const createFile = async () => {
    setIsLoading(true)
    setErrorMessage('')
    setResultPath('')

    try {
      const filePath = await window.ipc.file.createText(fileName)
      setResultPath(filePath)
      toast.success('Fichier cree avec succes', {
        description: filePath,
      })
      await loadFiles()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(message)
      toast.error('Echec de creation du fichier', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mt-4'>
      <p className='text-base font-semibold text-white sm:text-lg'>Creer un fichier .txt (userData/data)</p>
      <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
        <Input
          className='border-white/20 bg-slate-900/50 text-slate-100 placeholder:text-slate-400'
          placeholder='nom-du-fichier'
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
        />
        <Button onClick={createFile} disabled={isLoading || fileName.trim().length === 0} className='w-full sm:w-auto'>
          {isLoading ? 'Creation...' : 'Creer'}
        </Button>
        <Button onClick={loadFiles} disabled={isListing} variant='outline' className='w-full sm:w-auto'>
          {isListing ? 'Chargement...' : 'Rafraichir'}
        </Button>
      </div>
      {resultPath && <p className='mt-2 break-words text-sm text-emerald-300'>Fichier cree: {resultPath}</p>}
      {errorMessage && <p className='mt-2 break-words text-sm text-red-300'>Erreur: {errorMessage}</p>}
      <div className='mt-4'>
        <p className='text-sm font-semibold text-slate-100 sm:text-base'>Fichiers .txt existants</p>
        {files.length === 0 ? (
          <p className='text-sm text-slate-300'>Aucun fichier .txt</p>
        ) : (
          <div className='mt-2 overflow-hidden rounded-md border border-white/10 bg-slate-950/35'>
            <ScrollArea className='h-40 w-full'>
              <ul className='space-y-1 p-2 px-4 text-sm text-slate-200'>
                {files.map((file) => (
                  <li key={file.path} className='rounded-md border border-white/10 bg-slate-900/50 px-2 py-1'>
                    {file.name}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
