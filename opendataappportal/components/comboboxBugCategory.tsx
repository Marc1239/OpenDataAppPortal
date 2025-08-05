"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import settingsData from "@/app/data/einstellungen.json";

interface ComboboxCategoryProps {
    value: string
    onValueChange: (category: string) => void
  }

export function ComboboxBugCategory({ value, onValueChange }: ComboboxCategoryProps) {
    const [open, setOpen] = React.useState(false)

    const bugs = React.useMemo(() => {
        const set = new Set<string>()
        settingsData.einstellungen.forEach((einstellungen) => {
          einstellungen.bugs.forEach((bug) => {
            set.add(bug.title)
          })
        })
        return Array.from(set)
    }, [])

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Kategorie wählen ..." }
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Suche Fehler-Kategorie..." className="h-9" />
          <CommandList>
            <CommandEmpty>Keine Fehler-Kategorie gefunden.</CommandEmpty>
            <CommandGroup>
              {bugs.map((bug) => (
                <CommandItem
                  key={bug}
                  value={bug}
                  onSelect={(current) => {
                    onValueChange(current === value ? "" : current)
                    setOpen(false)
                  }}
                >
                  {bug}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === bug ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
