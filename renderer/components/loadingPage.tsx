import React from 'react'
import Image from 'next/image'

export default function LoadingPage({size}:{size:number}) {
  return (
    <React.Fragment>
      <div className="text-2xl w-full bg-gray-900/50 h-full fixed">
        <div className='h-full flex items-center justify-center'>
          <div>
            <Image
              className="ml-auto mr-auto animate-spin"
              src="/images/logo.png"
              alt="Logo image"
              width={size}
              height={size}
              property='Loader'
            />
          </div>
        </div>
        
      </div>
    </React.Fragment>
  )
}
