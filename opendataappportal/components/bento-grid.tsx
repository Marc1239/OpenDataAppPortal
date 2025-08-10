import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Tags, Zap, Mails } from 'lucide-react'
import MetaDataQualityPieChart from "./metaDataQualityPieChart"
import ModernToggle from "./ui/modern-toggle"
import { useState, useEffect } from "react"
import IntegrationPills from "./ui/integration-pills";

type BentoGridProps = {
  metaPercent: number;
  tags: string[];
  barrierFree: boolean;  
  city: string;          
};

export default function BentoGrid({ metaPercent, tags, barrierFree, city }: BentoGridProps) {
const [compact, setCompact] = useState(false)
const [isAccessible, setIsAccessible] = useState(barrierFree);
useEffect(() => setIsAccessible(barrierFree), [barrierFree]);

  return (
    <main className="min-h-dvh bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div
          className="
            grid gap-6
            grid-cols-4
            grid-rows-8
            
          "
        >
          {/* A — Tall photo with badge */}
          <Card className="relative overflow-hidden rounded-3xl border bg-muted/40 col-span-2 ">
            <CardContent className="p-0 w-full h-full">
              <div className="relative flex flex-col items-center justify-between h-full w-full">
                {/* gradient for readability */}
                <div className="left-1 top-1">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 rounded-full bg-white/80 text-foreground backdrop-blur-md"
                    aria-label="Featured"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Metadaten Qualität</span>
                  </Badge>
                </div>
                <MetaDataQualityPieChart percent={metaPercent} />
              </div>
              
            </CardContent>
          </Card>

          {/* B — Center logo and copy */}
          <Card className="relative rounded-3xl border bg-muted/40 col-span-1 row-span-1">
            <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
              <div className="flex flex-1 items-center justify-center">
                <ModernToggle
                  checked={isAccessible}
                  onCheckedChange={setCompact}
                />
              </div>
              <p className="mt-6 max-w-[38ch] text-center text-sm leading-6 text-muted-foreground">
                {barrierFree ? "Barrierefrei" : "Nicht barrierefrei"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border bg-muted/40">
            <CardContent className="flex h-full items-center justify-center p-6">
                <p>{city}</p>
            </CardContent>
          </Card>

          {/* C — Feedback */}
            <Card className="relative col-span-2 row-span-1 flex flex-col justify-center items-center rounded-3xl border bg-muted/40">
            <CardContent className="flex h-3/4 flex-col justify-between p-6">
                <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Mails className="h-5 w-5" />
                </div>
                <p>Hinterlasse Uns oder dem Entwickler gerne ein Feedback.</p>
                <div className="mt-8 flex justify-center flex-wrap gap-2">
                {/* Feedback an Entwickler */}
                <Drawer>
                    <DrawerTrigger asChild>
                    <Button className="rounded-md w-full" variant="default2">
                        Feedback an Entwickler
                    </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Was möchtest du mitteilen?</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4">
                        <Textarea placeholder="Dein Feedback…" className="min-h-32" />
                    </div>
                    <DrawerFooter className="flex flex-row gap-3 px-4">
                        <Button className="w-1/2">Senden</Button>
                        <DrawerClose asChild>
                        <Button className="w-1/2" variant="outline">Abbrechen</Button>
                        </DrawerClose>
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/* Feedback an App-Portal */}
                <Drawer>
                    <DrawerTrigger asChild>
                    <Button className="rounded-md w-full" variant="default2">
                        Feedback an App-Portal
                    </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Was möchtest du uns mitteilen?</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4">
                        <Textarea placeholder="Dein Feedback…" className="min-h-32" />
                    </div>
                    <DrawerFooter className="flex flex-row gap-3 px-4">
                        <Button className="w-1/2">Senden</Button>
                        <DrawerClose asChild>
                        <Button className="w-1/2" variant="outline">Abbrechen</Button>
                        </DrawerClose>
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                </div>
            </CardContent>
            </Card>

          {/* E — Price */}
          <Card className="relative rounded-3xl col-span-2 row-span-1 border bg-muted/40 ">
            <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Tags className="h-5 w-5" />
            </div>
            <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
              <IntegrationPills tags={tags} />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
