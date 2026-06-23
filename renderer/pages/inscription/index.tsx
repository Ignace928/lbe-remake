import React, { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { HeaderComponent } from "@/components/layout/header"
import {
  ArrowLeftFromLine,
  BookMarked,
  GraduationCap,
  LucideHome,
} from "lucide-react"

import { useAnneeStore } from "@/store/anneStore"
import {
  Card,
} from "@/components/ui/card"
import { useDatabaseStatusQuery } from "@/features/database/database_VModel"
import { useAuthStore } from "@/store/authStore"
import LoadingPage from "@/components/loadingPage"
import { ClasseListe } from "@/components/classe/classe_liste"
import { InscriptionTable } from "@/features/inscriptions/view/inscription_table"
import { getInscriptionFullName } from "@/features/inscriptions/view/inscriptionDetails"
import { TitleComponent } from "@/components/layout/title_component"
import { Classe } from "@/features/classes/classe_types"
import {
  useSelectedInscription,
  useSetInscription,
} from "@/store/inscriptionStore"
import SidebarMotion from "@/components/layout/Sidebar_Motion"
import { ScrollArea } from "@/components/ui/scroll-area"

function DatabaseNotReady() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <Card className="max-w-md w-full border-primary/20 bg-card/95 p-6 shadow-xl">
        <div className="flex flex-col items-center space-y-4 text-center">
          <BookMarked className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">
            Base de données non initialisée
          </h2>
          <p className="text-sm text-muted-foreground">
            Veuillez contacter l&apos;administrateur pour synchroniser la base
            de données.
          </p>
          <div className="w-full rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-sm text-amber-200">
              Impossible d&apos;accéder aux données des inscriptions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function PageTitleBar({
  title,
  actions,
  navigation,
}: {
  title: string
  actions?: React.ReactNode
  navigation?: React.ReactNode
}) {
  const { anne_Active } = useAnneeStore()

  return (
      <TitleComponent Icon={GraduationCap}>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">{title}</p>
          {anne_Active.labelle ? (
            <p className="mt-1 font-mono text-xs text-primary/90">
              Année : {anne_Active.labelle}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
          {navigation}
        </div>
      </TitleComponent>
  )
}

function ClassSelectionPanel({ setClasse } : { setClasse: (classe: Classe) => void }) {
  return (
    <div className="">
      <ClasseListe Click={setClasse}/>
    </div>
  )
}

function InscriptionClassPanel({
  idAnnee,
  classe,
  onClasseUpdated,
}: {
  idAnnee: string
  classe: Classe
  onClasseUpdated: (classe: Classe) => void
}) {
  return (
    
      <InscriptionTable
        id_anne={idAnnee}
        id_classe={classe.id_classe}
        classe={classe}
        onClasseUpdated={onClasseUpdated}
      />
  )
}

export default function InscriptionPage() {
  const { anne_Active } = useAnneeStore()
  const [classe, setClasse] = useState<Classe | null>(null)
  const { user, hasHydrated } = useAuthStore()
  const { data, isLoading, error: DBError } = useDatabaseStatusQuery()
  // const { refetch } = useInscriptionVm({
  //   id_anne: anne_Active.id_anne,
  //   id_classe: classe?.id_classe ?? 0,
  // })
  const router = useRouter()
  const selected = useSelectedInscription()
  const {clear} = useSetInscription()

  useEffect(() => {
    if (!hasHydrated) return
    if (!user) window.location.href = "/"
    else if (user.role === "admin") window.location.href = "/admin"
  }, [user, hasHydrated])

  // useEffect(() => {
  //   if (classe?.id_classe) refetch()
  // }, [classe, refetch])

  const handleBackToClasses = () => {
    clear()
    setClasse(null)
  }

  const pageTitle = selected
    ? getInscriptionFullName(selected)
    : "Gestion des inscriptions"



  const titleNavigation =
    selected && classe ? (
      <Button variant="outline" className="rounded-full" onClick={clear}>
        <ArrowLeftFromLine className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>
    ) : classe ? (
      <Button
        variant="secondary"
        className="rounded-full"
        onClick={handleBackToClasses}
      >
        <ArrowLeftFromLine className="mr-2 h-4 w-4" />
        {classe.nom_classe}
      </Button>
    ) : undefined

  if (isLoading || !hasHydrated) {
    return <LoadingPage size={40} />
  }

  if (DBError || !data?.initialized) {
    return <DatabaseNotReady />
  }

  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Inscriptions</title>
      </Head>

      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title="Inscriptions">
            <Button
              className="m-1 h-10 w-10 rounded-full"
              onClick={() => {
                clear()
                router.push("/home")
              }}
            >
              <LucideHome className="h-4 w-4" />
            </Button>
          </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
        
            <ScrollArea className="min-h-0 flex flex-col h-full">

              <PageTitleBar
                  title={pageTitle}
                  navigation={titleNavigation}
                  />
              

                {classe ? (
                  <InscriptionClassPanel
                    idAnnee={anne_Active.id_anne ?? ""}
                    classe={classe}
                    onClasseUpdated={setClasse}
                    />
                  ) : (
                    <ClassSelectionPanel setClasse={setClasse} />
                )}
                
            </ScrollArea>

          </Card>
          <SidebarMotion current="/inscription"/>
        </main>
      </div>
    </>
  )
}
