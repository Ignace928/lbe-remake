export function HeaderComponent({
  children,
  title,
}: {
  children?: React.ReactNode
  title: string
}) {
  return (
    <header className='w-full rounded-2xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-xl'>
      <div className='flex min-h-14 w-full items-center gap-2 px-3 sm:px-4 lg:px-6'>
        <h1 className='truncate text-base font-semibold text-slate-900 sm:text-lg'>{title}</h1>
        <div className='ml-auto flex items-center gap-2'>{children}</div>
      </div>
      <div className='h-px w-full bg-gradient-to-r from-transparent via-lime-400/60 to-transparent' />
    </header>
  )
}