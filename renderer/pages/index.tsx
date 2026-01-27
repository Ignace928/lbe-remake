import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <div>
          <Image
            className="ml-auto mr-auto hover:animate-spin [animation-duration:3s]"
            src="/images/logo.png"
            alt="Logo image"
            width={256}
            height={256}
          />
        </div>
        <span>⚡ Nextron ⚡</span>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home" className={buttonVariants({variant:"default"})}>Go to home page</Link>
        <Card className=' m-2 bg-primary hover:bg-chart-3/20 hover:m-4 transition-all duration-300 cursor-pointer'>
          <CardHeader> Titre</CardHeader>
          <CardContent>
            <CardDescription>
              Ceci est une desciption de la carte
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  )
}
