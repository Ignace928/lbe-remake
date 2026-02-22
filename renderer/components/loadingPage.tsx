import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function LoadingPage({size}:{size:number}) {
  return (
    <React.Fragment>
      <div className="text-2xl w-full bg-gray-900/50 h-screen fixed">
        <div className='h-full flex items-center justify-center'>
          <div>
            <Image
              className="ml-auto mr-auto animate-spin"
              src="/images/logo.png"
              alt="Logo image"
              width={size}
              height={size}
            />
          </div>
        </div>
        
      </div>
    </React.Fragment>
  )
}
