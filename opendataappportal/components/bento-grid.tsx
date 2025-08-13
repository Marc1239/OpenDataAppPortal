import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";
import { CalendarClock, ExternalLink, Github, Globe, Apple, Smartphone, Tags, Mails, Zap, Bug, Info, Mail } from 'lucide-react'
import { FaGooglePlay, FaApple } from "react-icons/fa";
//import MetaDataQualityPieChart from "./metaDataQualityPieChart"
import ModernToggle from "./ui/modern-toggle"
import { useState, useEffect } from "react"
import IntegrationPills from "./ui/integration-pills";
import dynamic from "next/dynamic";

const MetaDataQualityPieChart = dynamic(
  () => import("@/components/metaDataQualityPieChart"),
  { ssr: false, loading: () => <div style={{ width: 160, height: 160 }} /> }
);

type BentoGridProps = {
  metaPercent: number;
  tags: string[];
  barrierFree: boolean;  
  city: string;
  websiteLink?: string;
  githubLink?: string;
  appStoreLinkApple?: string;
  appStoreLinkAndroid?: string;
  publishDate?: string;
  publishInformation?: string;
  latestRelease?: string;
  reportBugLink?: string; 
  supportMail?: string;         
};

export default function BentoGrid({ 
  metaPercent, tags, barrierFree, city,
  websiteLink, githubLink,
  appStoreLinkApple, appStoreLinkAndroid,
  publishDate, publishInformation, latestRelease,
  reportBugLink, supportMail
}: BentoGridProps) {
const [compact, setCompact] = useState(false)
const [isAccessible, setIsAccessible] = useState(barrierFree);
useEffect(() => setIsAccessible(barrierFree), [barrierFree]);

  return (
    <main className="h-auto bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div
          className="
            grid gap-6
            grid-cols-4
            grid-rows-5
          "
        >
          {/* PieChart - Metadata Quality */}
          <Card className="relative overflow-hidden rounded-3xl border bg-muted/40 col-span-2 ">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="absolute left-3 gap-2 top-3 flex h-10 w-48 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Metadaten Qualität</span>
              </div>
              <div className="relative flex flex-col items-center justify-center h-full w-full">
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
                <div className="absolute left-3 gap-2 top-3 flex h-10 w-36 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                  <Mails className="h-5 w-5" />
                  <span>Feedback</span>
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
            <div className="absolute left-3 gap-2 top-3 flex h-10 w-24 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Tags className="h-5 w-5" />
                <span>Tags</span>
            </div>
            <CardContent className="flex h-full flex-col justify-center p-6 md:p-8">
              <IntegrationPills tags={tags} />
            </CardContent>
          </Card>

          {/* Website & GitHub */}
          <Card className="relative rounded-3xl border bg-muted/40 col-span-2">
            <CardContent className="flex h-full flex-col gap-4 p-6 md:p-8">
              <div className="absolute left-3 top-3 flex h-10 w-24 gap-2 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <ExternalLink className="h-4 w-4" />
                <span>Links</span>
              </div>
              <div className="flex flex-col w-full h-full justify-center items-stretch gap-3">
                {websiteLink ? (
                  <Button asChild variant="outline">
                    <Link href={websiteLink} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Webseite
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="cursor-not-allowed"><Globe className="mr-2 h-4 w-4" />Webseite</Button>
                )}
                {githubLink ? (
                  <Button asChild variant="outline">
                    <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="cursor-not-allowed"><Github className="mr-2 h-4 w-4" />GitHub</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Downloads (App Store / Google Play) */}
          <Card className="relative rounded-3xl border bg-muted/40 col-span-2">
            <CardContent className="flex h-full flex-col gap-4 p-6 md:p-8">
              <div className="absolute left-3 top-3 flex h-10 w-36 gap-2 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Smartphone className="h-4 w-4" />
                <span>Downloads</span>
              </div>
              <div className="flex flex-col w-full h-full justify-center items-stretch gap-3">
                {appStoreLinkApple ? (
                  <Button asChild>
                    <Link href={appStoreLinkApple} target="_blank" rel="noopener noreferrer">
                      <FaApple className="mr-2 h-4 w-4" />
                      App Store
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="cursor-not-allowed"><FaApple className="mr-2 h-4 w-4" />App Store</Button>
                )}
                {appStoreLinkAndroid ? (
                  <Button asChild>
                    <Link href={appStoreLinkAndroid} target="_blank" rel="noopener noreferrer">
                      <FaGooglePlay className="mr-2 h-4 w-4" />
                      Google Play Store
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="cursor-not-allowed"><FaGooglePlay className="mr-2 h-4 w-4" />Google Play</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Veröffentlichungen / Changelog */}
          <Card className="relative rounded-3xl border bg-muted/40 col-span-4">
            <CardContent className="flex h-full flex-col justify-center items-center gap-4 p-6 md:p-8">
              <div className="absolute left-3 top-3 flex h-10 w-48 gap-2 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <CalendarClock className="h-4 w-4" />
                <span>Veröffentlichungen</span>
              </div>
              <div className="grid gap-2 pt-4">
                {publishDate && (
                  <p className="text-sm">
                    <span className="font-medium">Erstveröffentlichung:</span> {publishDate}
                  </p>
                )}
                {latestRelease && (
                  <p className="text-sm">
                    <span className="font-medium">Letztes Release:</span> {latestRelease}
                  </p>
                )}
                {publishInformation ? (
                  <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="leading-6">{publishInformation}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine zusätzlichen Veröffentlichungsinformationen vorhanden.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bug melden */}
          <Card className="relative rounded-3xl border bg-muted/40 col-span-2">
            <CardContent className="flex h-full w-full flex-col justify-center items-stretch gap-4 p-6 md:p-8">
              <div className="absolute left-3 top-3 flex h-10 w-36 gap-2 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Bug className="h-4 w-4" />
                <span>Fehler melden</span>
              </div>
              {reportBugLink ? (
                <Button asChild>
                  <Link href={reportBugLink} target="_blank" rel="noopener noreferrer">
                    <Bug className="mr-2 h-4 w-4" />
                    Issue erstellen
                  </Link>
                </Button>
              ) : githubLink ? (
                <Button asChild variant="outline">
                  <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Zum Repository
                  </Link>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Kein Bug-Tracker verlinkt.</p>
              )}
            </CardContent>
          </Card>

          {/* Support Mail */}

          <Card className="relative rounded-3xl border bg-muted/40 col-span-2">
            <CardContent className="flex h-full w-full flex-col justify-center items-stretch gap-4 p-6 md:p-8">
              <div className="absolute left-3 top-3 flex h-10 w-52 gap-2 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border">
                <Mail className="h-4 w-4" />
                <span>Support Kontaktieren</span>
              </div>
              {supportMail ? (
                <Button asChild>
                  <Link href={`mailto:${supportMail}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Support kontaktieren
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="cursor-not-allowed" disabled>
                  <Mail className="mr-2 h-4 w-4" />
                  Keine Support Mail vorhanden
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
