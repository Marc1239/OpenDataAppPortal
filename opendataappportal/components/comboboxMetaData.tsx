"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import rawApps from "@/app/data/apps_dresden.json"
import { calcMetaQuality } from "@/utils/metadata-quality"

type AppsRec = Record<string, Record<string, unknown>>

interface ComboboxMetaDataProps {
  value: string
  onValueChange: (quality: string) => void   // z.B. "90%"
}

export function ComboboxMetaData({ value, onValueChange }: ComboboxMetaDataProps) {
  const [open, setOpen] = React.useState(false)

  const qualities = React.useMemo(() => {
    const apps = rawApps as unknown as AppsRec

    // 1) Prozent je App berechnen → 2) auf 10er runden → 3) 0% optional entfernen → 4) unique & sort
    const tens = Object.values(apps)
      .map(rec => calcMetaQuality(rec))                          // "87%"
      .map(s => parseInt(String(s).replace("%",""), 10))         // 87
      .filter(n => Number.isFinite(n))
      .map(n => Math.min(100, Math.max(0, Math.round(n/10)*10))) // 90
      .filter(n => n > 0)                                        // 0% ausblenden (optional)

    const unique = Array.from(new Set(tens)).sort((a,b) => b - a) // absteigend
    return unique.map(n => `${n}%`)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value || "Metadaten-Qualität wählen …"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Suche Quality-Score..." className="h-9" />
          <CommandList>
            <CommandEmpty>Keine Metadaten-Scores gefunden.</CommandEmpty>
            <CommandGroup>
              {qualities.map(q => (
                <CommandItem
                  key={`quality-${q}`}   
                  value={q}
                  onSelect={(current) => {
                    onValueChange(current === value ? "" : current)
                    setOpen(false)
                  }}
                >
                  {q}
                  <Check className={cn("ml-auto", value === q ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
