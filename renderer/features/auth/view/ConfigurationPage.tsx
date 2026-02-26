import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, DatabaseZap } from "lucide-react"
import Head from "next/head"
import React from "react"

export const ConfigurationPage = ({description} : {description:string}) => {
  
  return(
      <React.Fragment>
          <Head>
            <title>Configuration requise - LBE Schoolar</title>
          </Head>
          
          <ScrollArea className="p-4 space-y-6 h-screen">
            <CardContent className="flex items-center justify-center min-h-full">
              <Card className="w-full max-w-md m-4 border-orange-200">
                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-orange-800">Configuration requise</CardTitle>
                  <p className="text-sm text-orange-700">
                    La base de données n'est pas synchronisée. Veuillez configurer l'application avant de continuer.
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <DatabaseZap className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Base de données non initialisée</p>
                        <p className="text-sm text-orange-700 mt-1">
                          {description || "La synchronisation est nécessaire pour utiliser l'application."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    onClick={() => window.location.href = '/admin' }
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <DatabaseZap className="h-4 w-4 mr-2" />
                    Aller à l'administration
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Actualiser
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </ScrollArea>
        </React.Fragment>
  )
}
