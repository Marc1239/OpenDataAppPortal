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

import appsData from "@/app/data/apps_dresden.json";

interface ComboboxCityProps {
    value: string
    onValueChange: (city: string) => void
  }

export function ComboboxCity({ value, onValueChange }: ComboboxCityProps) {
    const [open, setOpen] = React.useState(false)

    const cities = React.useMemo(() => {
        const set = new Set<string>()
        Object.values(appsData).forEach((app) => set.add(app.city))
        return Array.from(set)
    }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value || "Stadt wählen ..." }
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Suche Stadt..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(current) => {
                    onValueChange(current === value ? "" : current)
                    setOpen(false)
                  }}
                >
                  {city}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === city ? "opacity-100" : "opacity-0"
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
