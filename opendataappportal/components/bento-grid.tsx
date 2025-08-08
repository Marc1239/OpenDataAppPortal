import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CuboidIcon as Cube, Zap } from 'lucide-react'
import MetaDataQualityPieChart from "./metaDataQualityPieChart"
import ModernToggle from "./ui/modern-toggle"
import { useState } from "react"

type BentoGridProps = {
  metaPercent: number; 
};

export default function BentoGrid({ metaPercent }: BentoGridProps) {
const [compact, setCompact] = useState(false)
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
                  checked={compact}
                  onCheckedChange={setCompact}
                />
              </div>
              <p className="mt-6 max-w-[38ch] text-center text-sm leading-6 text-muted-foreground">
                Nicht barrierefrei
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border bg-muted/40">
            <CardContent className="flex h-full items-center justify-center p-6">
              <div className="flex size-14 items-center justify-center rounded-xl border bg-background shadow-sm">
                <p>Stadt</p>
              </div>
            </CardContent>
          </Card>

          {/* C — 95% stat */}
          <Card className="rounded-3xl border bg-muted/40">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="text-4xl font-semibold tracking-tight">95%</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Developers choose us for our exceptional quality
                </p>
              </div>
              <div className="mt-3 h-10 w-10 rounded-xl bg-background/70 ring-1 ring-border flex items-center justify-center">
                <Cube className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          

          {/* E — Price */}
          <Card className="rounded-3xl border bg-muted/40 ">
            <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
              <div>
                <div className="text-5xl font-semibold tracking-tight">$299</div>
                <p className="mt-2 text-sm text-muted-foreground">Premium Component Library</p>
              </div>
              <div className="pt-4">
                <Button className="rounded-full">Buy Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
