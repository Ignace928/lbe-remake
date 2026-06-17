import { LucideIcon } from "lucide-react"

export function TitleComponent({
  children,
  Icon
}: {
  children?: React.ReactNode
  Icon:LucideIcon
}) {
  return (
      <div className="sticky top-0 z-4 backdrop-blur-3xl">
        <div className='flex items-center gap-4 p-4 rounded-t-2xl bg-linear-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
            <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-primary'>
                <Icon className='h-6 w-6 text-primary-foreground transition-all duration-300' />
            </div>
            {children}
        </div>
      </div>
  )
}


