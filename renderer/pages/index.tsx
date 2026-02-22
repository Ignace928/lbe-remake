import React, { useEffect } from 'react'
import Head from 'next/head'
import LoadingPage from '@/components/loadingPage'

export default function NextPage() {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.href = '/home'
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [])
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      {/* LOADIN PAGE */}
        <LoadingPage size={50}/>

      <div className="grid grid-col-1 text-2xl w-full text-center">
        <span>⚡ Ici c'est la logique Login ⚡</span>
        
        <span>+</span>
        <span>Next.js</span>
        <span>+</span>
        <span>tailwindcss</span>
        <span>=</span>
        <span>💕 </span>
      </div>
    </React.Fragment>
  )
}
