"use client";

import { ComboboxCity } from "@/components/comboboxCity";
import { ComboboxCategory } from "@/components/comboboxCategory";
import { ComboboxMetaData } from "@/components/comboboxMetaData";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { TagsFilter } from "@/components/tags-filter";
import { FilterBarProps } from "@/types/app";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";


export default function FiltersBar({
  city, category, meta, accessibleOnly, selectedTags, suggestions,
  onCity, onCategory, onMeta, onAccessible, onTags, onReset
}: FilterBarProps) {
  return (
    <Accordion className='w-full' type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger className='text-left py-4 flex flex-row justify-between w-full'>
                Filtereinstellungen
                <ChevronDownIcon className="AccordionChevron" aria-hidden />
            </AccordionTrigger>
            <AccordionContent>
                <div className="w-full h-auto gap-2 grid grid-cols-3 grid-rows-2 items-start">
                    <div className="col-span-1">
                        <ComboboxCity value={city} onValueChange={onCity} />
                    </div>
                    <div className="col-span-1">
                        <ComboboxCategory value={category} onValueChange={onCategory} />
                    </div>
                    <div className="col-span-1">
                        <ComboboxMetaData value={meta} onValueChange={onMeta} />
                    </div>

                    <div className="col-span-2">
                        <TagsFilter value={selectedTags} onChange={onTags} suggestions={suggestions} maxTags={5} />
                    </div>

                    <div className="col-span-1 grid grid-cols-2 gap-2">
                        <ToggleButton
                        className="col-span-1"
                        pressed={accessibleOnly}
                        onPressedChange={onAccessible}
                        >
                            Barrierefrei
                        </ToggleButton>

                        <Button className="col-span-1" variant="destructive" onClick={onReset}>
                            <Trash className="mr-2 h-4 w-4" />
                            Zurücksetzen
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  );
}
