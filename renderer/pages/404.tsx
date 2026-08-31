import { Button, buttonVariants } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function Not_found() {
  return (
    <Card className='flex flex-col gap-4 items-center justify-center'>
        <CardHeader>
            <CardTitle className='text-3xl'>
                404 - Not found
            </CardTitle>
        </CardHeader>
            <CardFooter>
              <Link href="/home" className={buttonVariants({variant:"outline"})}>Accueil</Link>
            </CardFooter>
    </Card>
  )
}
