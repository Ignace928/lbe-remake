import React, { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  
  // Convertir la string value en Date pour le Calendar
  const selectedDate = value ? new Date(value) : undefined
  
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Formater la date en YYYY-MM-DD pour le backend
      const formattedDate = format(date, 'yyyy-MM-dd')
      onChange?.(formattedDate)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "dd MMMM yyyy", { locale: fr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md border shadow w-60"
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  )
}
