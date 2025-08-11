"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  className?: string;
  children: React.ReactNode;
};

export function ToggleButton({ pressed, onPressedChange, className, children }: Props) {
  return (
    <Button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "w-full h-9 rounded-md transition-colors",
        pressed
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
        className
      )}
      variant={pressed ? "default" : "secondary"}
    >
      {children}
    </Button>
  );
}
