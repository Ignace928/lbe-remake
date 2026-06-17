import React, { useEffect } from 'react'
import Head from 'next/head'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import LoadingPage from '@/components/loadingPage'
import { useAnneeStore } from '@/store/anneStore'

export default function NextPage() {
  const {setAnne_active} = useAnneeStore()
  useEffect(()=>{
    setAnne_active({id_anne:null, labelle:""})
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = '/start'
  }
  return (
    <React.Fragment>
      <Head>
        <title>Se connecter</title>
      </Head>
      {/* LOADIN PAGE */}
      {
        <LoadingPage size={40}/>
      }
      <ScrollArea className="p-4 space-y-6 h-1/2">
        <CardContent className="flex items-center justify-center">
          <Card className="w-1/3 m-4">
            <CardHeader className="text-center">
              <CardTitle>Login</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                      <label>Utilisateur</label>
                      <Input type="text" className="mt-2 border-primary/50" />
                    </div>

                    <div>
                      <label>Mot de passe</label>
                      <Input type="password" className="mt-2 border-primary/50"/>
                    </div>

                    <CardFooter className="flex gap-2">
                      <Button type="submit" className="">
                        Se connecter
                      </Button>
                    </CardFooter>
              </form>
                      <Button onClick={()=>window.location.href = '/admin'} className="">
                        Admin
                      </Button>
            </CardContent>
          </Card>
        </CardContent>
      </ScrollArea>
    </React.Fragment>
  )
}
