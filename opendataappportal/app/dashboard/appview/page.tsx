"use client";
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  } from '@/components/ui/card'
import { CardCurtain, CardCurtainReveal, CardCurtainRevealBody, CardCurtainRevealDescription, CardCurtainRevealFooter, CardCurtainRevealTitle } from '@/components/ui/card-curtain-reveal'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import appsDresdenData from "../../data/apps_dresden.json"
import { ComboboxCity } from '@/components/combobox'
import { Checkbox } from '@/components/ui/checkbox'

export interface AppData {
    title: string
    city: string
    barrierFree: boolean
    description: string
    image: string
  }


export interface AppEntry {
    key: string
    data: AppData
  }


  const AppView: React.FC = () => {

  const [selectedCity, setSelectedCity] = React.useState<string>("")
  const [accessibleOnly, setAccessibleOnly] = React.useState<boolean>(true)
  
  const apps = React.useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => ({
      key,
      data: data as AppData ,
    }))
  }, [])


  const filteredApps = React.useMemo(() => {
    return apps.filter(({ data }) => {
      if (selectedCity && data.city !== selectedCity) return false
      if (accessibleOnly && !data.barrierFree) return false
      return true
    })
  }, [apps, selectedCity, accessibleOnly])
  
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        {/*<Badge className='w-fit text-xl'>Unsere Apps</Badge>*/}
        {/*<h1 className='text-9xl text-center'>Modern solutions. Timeless design.</h1>*/}
        <div className='w-full h-24 flex gap-4 items-center'>
            <ComboboxCity 
                value={selectedCity}
                onValueChange={setSelectedCity}
            />
            <div className='flex items-center gap-2'>
                <Checkbox 
                    checked={accessibleOnly}
                    onCheckedChange={(val) => setAccessibleOnly(!!val)}
                />
                <p>Barrierefrei</p>
            </div>
        </div>
        <div className="my-4 flex justify-center flex-wrap gap-4">
            {filteredApps.map(({ key, data }) => (
                <Boxes
                    key={key}
                    title={data.title}
                    city={data.city}
                    barrierFree={data.barrierFree}
                    description={data.description}
                    image={data.image}
                />
            ))}
        </div>
    </div>
  )
}

export default AppView


interface BoxesProps extends AppData {}

const Boxes: React.FC<BoxesProps> = ({ title, description, image }) => {
    return (
        <CardCurtainReveal className="h-[560px] w-auto max-w-[400px] border rounded-md border-zinc-100 bg-gradient-to-br from-primary to-stone-50 text-zinc-950 shadow">
        <CardCurtainRevealBody className="">
          <CardCurtainRevealTitle className="text-3xl font-medium tracking-tight">
            {title}
          </CardCurtainRevealTitle>
          <CardCurtainRevealDescription className="my-4 ">
            <p>
            {description}
            </p>
          </CardCurtainRevealDescription>
          <Button
            variant={"secondary"}
            size={"icon"}
            className="aspect-square rounded-full"
          >
            <ArrowUpRight />
          </Button>

          <CardCurtain className=" bg-slate-50" />
        </CardCurtainRevealBody>

        <CardCurtainRevealFooter className="mt-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="100%"
            height="100%"
            alt={title}
            className=""
            src={image}
          />
        </CardCurtainRevealFooter>
      </CardCurtainReveal>
    )
}