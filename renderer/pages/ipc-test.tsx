import Head from 'next/head'
import Link from 'next/link'
import { useHelloWorldViewModel } from '@/features/hello-world/viewmodel/use-hello-world.viewmodel'

export default function IpcTestPage() {
  const model = useHelloWorldViewModel()

  return (
    <>
      <Head>
        <title>IPC Test - Nextron</title>
      </Head>
      <main className="mx-auto mt-10 max-w-xl px-6 text-center">
        <h1 className="text-2xl font-semibold">IPC Test (MVVM)</h1>
        {model.isLoading && <p className="mt-4">Loading message...</p>}
        {!model.isLoading && model.error && (
          <p className="mt-4 text-red-500">Error: {model.error}</p>
        )}
        {!model.isLoading && !model.error && (
          <p className="mt-4 text-lg">{model.message}</p>
        )}
        <div className="mt-6">
          <Link href="/">Back to index</Link>
        </div>
      </main>
    </>
  )
}

