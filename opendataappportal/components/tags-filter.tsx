"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTags } from "@/hooks/use-tags";
import { Button } from "@/components/ui/button";

export type UITag = { id: string; label: string; color?: string };

const DEFAULT_SUGGESTIONS: UITag[] = [
  { id: "essen", label: "Essen" },
  { id: "freizeit", label: "Freizeit" },
  { id: "nachhaltigkeit", label: "Nachhaltigkeit" },
  { id: "politik", label: "Politik" },
  { id: "sport", label: "Sport" },
];

interface TagsFilterProps {
  value?: UITag[];                         
  onChange?: (tags: UITag[]) => void;      
  suggestions?: UITag[];                   
  maxTags?: number;                        
  placeholder?: string;                    
}

export function TagsFilter({
  value,
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  maxTags = 5,
  placeholder = "Tag hinzufügen..."
}: TagsFilterProps) {
  const [inputValue, setInputValue] = useState("");

  const isControlled = value !== undefined && onChange !== undefined;

  // Uncontrolled Fallback (alter Hook)
  const uncontrolled = useTags({
    maxTags,
    onChange,
  });

  const tags = isControlled ? value! : uncontrolled.tags;
  const hasReachedMax = tags.length >= maxTags;

  const addTag = (tag: UITag) => {
    if (hasReachedMax) return;
    if (isControlled) {
      if (!tags.some(t => t.id === tag.id)) onChange!([...tags, tag]);
    } else {
      uncontrolled.addTag(tag);
    }
  };

  const removeTag = (id: string) => {
    if (isControlled) onChange!(tags.filter(t => t.id !== id));
    else uncontrolled.removeTag(id);
  };

  const removeLastTag = () => {
    if (tags.length === 0) return;
    removeTag(tags[tags.length - 1].id);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      removeLastTag();
    }
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const raw = inputValue.trim();
      addTag({ id: raw.toLowerCase(), label: raw });
      setInputValue("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="rounded-lg border border-input bg-background p-1">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm",
                  tag.color || "bg-primary/10 text-primary"
                )}
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasReachedMax ? "Maximale Anzahl an Tags erreicht" : placeholder}
              disabled={hasReachedMax}
              className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Vorschläge</label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => {
            const isSelected = tags.some(t => t.id === s.id);
            return (
              <Button
                key={s.id}
                variant="outline"
                size="sm"
                onClick={() => { if (!isSelected) addTag(s); }}
                disabled={hasReachedMax || isSelected}
              >
                {s.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
