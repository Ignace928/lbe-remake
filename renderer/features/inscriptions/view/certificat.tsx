import React, { useMemo } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { FileDown, FileScan, Loader2 } from "lucide-react"
import { SchoolCertificate } from "@/features/eleves/view/certificat"
import { useEleveByIdQuery } from "@/features/eleves/eleve_VModel"
import { useAnneeStore } from "@/store/anneStore"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Inscription } from "../inscription_types"
import { Eleve } from "@/features/eleves/eleve_types"
import Image from "next/image"

export type InscriptionCertificateData = {
  studentName: string
  birthDate: string
  classLevel: string
  year: string
  sexe:"M"|"F"
}

export function buildInscriptionCertificateData(
  inscription: Inscription,
  eleveFull?: Eleve | null,
  anneeFallback = ""
): InscriptionCertificateData {
  const { eleve, classe, anneeScolaire } = inscription

  const studentName = eleve
    ? `${eleve.nom_eleve} ${eleve.post_nom_eleve ?? ""}`.trim()
    : eleveFull
      ? `${eleveFull.nom_eleve} ${eleveFull.post_nom_eleve ?? ""}`.trim()
      : `Élève #${inscription.id_eleve}`

  const birthDate = eleveFull?.date_naissance
    ? format(new Date(eleveFull.date_naissance), "dd MMMM yyyy", { locale: fr })
    : "Non renseigné"

  const classLevel = classe
    ? `${classe.nom_classe}`
    : `Classe #${inscription.id_classe}`

  const year =
    anneeScolaire?.libelle?.trim() ||
    anneeFallback.trim() ||
    inscription.id_annee
  const sexe = eleveFull?.sexe

  return { studentName, birthDate, classLevel, year, sexe }
}

export function CertificatePreview({
  data,
  className,
}: {
  data: InscriptionCertificateData
  className?: string
}) {
  const issuedAt = format(new Date(), "dd MMMM yyyy", { locale: fr })

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-foreground/15 bg-linear-to-b from-white to-slate-50 p-6 text-slate-900 shadow-inner",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60" />

      <header className="border-b border-slate-200 pb-4 text-center flex justify-start gap-60 items-baseline-last">
        <Image src="/images/benjamin.png" alt="l" width={50} height={50}/>
        <div>

          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            LYCEE FJKM — BENJAMIN ESCANDE
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            DREN AMORON'I MANIA Ambositra - 306
          </p>
        </div>
      </header>

      <h4 className="mt-5 text-center text-sm font-bold tracking-wide text-slate-800 uppercase underline decoration-primary/40 underline-offset-4">
        Certificat de scolarité
      </h4>

      <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
        <p>
          Je soussigné, Directeur de l&apos;établissement{" "}
          <span className="font-semibold text-slate-900">LBE Schoolar</span>,
          certifie que l&apos;élève :
        </p>
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center text-base font-bold text-slate-900">
          {data.studentName}
        </p>
        <p>
          <span className="text-slate-500">Né(e) le :</span> {data.birthDate}
        </p>
        <p>
          Est régulièrement inscrit(e) en classe de{" "}
          <span className="font-semibold text-slate-900">{data.classLevel}</span>
        </p>
        <p>
          Pour l&apos;année scolaire{" "}
          <span className="font-semibold text-primary">{data.year}</span>
        </p>
      </div>

      <footer className="mt-8 flex items-end justify-between gap-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <p>Fait à Ambositra, le {issuedAt}</p>
        <div className="text-center">
          <p className="mb-8 font-medium text-slate-700">Le Directeur</p>
        </div>
      </footer>
    </div>
  )
}

export function InscriptionCertificateSection({
  inscription,
}: {
  inscription: Inscription
}) {
  const anneeFallback = useAnneeStore((state) => state.anne_Active.labelle)

  const { data: eleveFull, isLoading: isLoadingEleve } = useEleveByIdQuery(
    inscription.id_eleve
  )

  const certificateData = useMemo(
    () => buildInscriptionCertificateData(inscription, eleveFull, anneeFallback),
    [inscription, eleveFull, anneeFallback]
  )

  const fileName = `certificat-${certificateData.studentName.replace(/\s+/g, "-")}.pdf`

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileScan className="h-4 w-4 text-primary" />
          Certificat de scolarité
        </h3>
        <PDFDownloadLink
          className={buttonVariants({ variant: "outline", size: "sm" })}
          document={<SchoolCertificate data={certificateData} />}
          fileName={fileName}
        >
          {({ loading }) =>
            loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Télécharger PDF
              </span>
            )
          }
        </PDFDownloadLink>
      </div>

      {isLoadingEleve ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SchoolCertificate data={certificateData}/>
      )}
    </section>
  )
}
