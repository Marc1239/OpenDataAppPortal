"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Moon, SunMedium } from 'lucide-react'

type ModernToggleProps = {
  id?: string
  label?: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  showIcons?: boolean
  className?: string
}

export function ModernToggle({
  id,
  label = "",
  description = "",
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  showIcons = false,
  className,
}: ModernToggleProps) {
  const reactId = React.useId()
  const controlId = id ?? `modern-toggle-${reactId}`
  const isControlled = typeof checked === "boolean"
  const [internal, setInternal] = React.useState<boolean>(defaultChecked)
  const isOn = isControlled ? (checked as boolean) : internal

  const handleChange = (next: boolean) => {
    return false; // rausnehmen, damit toggle wieder funktioniert
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="relative inline-flex">
        {/* Subtiler Glow-Halo */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-1 rounded-full blur-md transition-opacity duration-300",
            isOn ? "opacity-100 bg-primary/25" : "opacity-0"
          )}
        />
        <div className="relative">
          <Switch
            id={controlId}
            checked={isOn}
            onCheckedChange={handleChange}
            disabled={disabled}
            aria-label={label || "Umschalter"}
            className={cn(
              // Basis: Track
              "transition-all duration-300",
              // Gradient-Zustand
              "bg-gradient-to-r from-slate-300 to-primary/50 dark:primary/80 dark:to-primary",
              "data-[state=checked]:from-primary data-[state=checked]:to-primary",
              // dezenter Ring/Shadow im aktiven Zustand
              "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
              "data-[state=checked]:shadow-[0_6px_20px_rgba(188, 188, 110, 0.8)]",
              // Leicht größere Klickfläche
              "h-7 w-[48px]"
            )}
          />
          {showIcons && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-between px-1"
            >
              <Moon
                className={cn(
                  "size-3.5 text-slate-500 transition-opacity duration-200",
                  isOn ? "opacity-0" : "opacity-100"
                )}
              />
              <SunMedium
                className={cn(
                  "size-3.5 transition-opacity duration-200",
                  isOn ? "opacity-100 text-emerald-950/80 dark:text-emerald-50" : "opacity-0"
                )}
              />
            </span>
          )}
        </div>
      </div>

      {(label || description) && (
        <label
          htmlFor={controlId}
          className={cn(
            "cursor-pointer select-none",
            disabled ? "cursor-not-allowed opacity-70" : ""
          )}
        >
          {label && (
            <div className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
              {label}
            </div>
          )}
          {description && (
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{description}</div>
          )}
        </label>
      )}
    </div>
  )
}

export default ModernToggle
