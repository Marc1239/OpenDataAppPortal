import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  } from '@/components/ui/card'
import { CardCurtain, CardCurtainReveal, CardCurtainRevealBody, CardCurtainRevealDescription, CardCurtainRevealFooter, CardCurtainRevealTitle } from '@/components/ui/card-curtain-reveal'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import appsDresdenData from "../../data/apps_dresden.json"

export interface AppData {
    title: string
    city: string
    description: string
    image: string
  }

const AppView = () => {

  const apps = Object.entries(appsDresdenData) as [string, AppData][]
  
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        {/*<Badge className='w-fit text-xl'>Unsere Apps</Badge>*/}
        <h1 className='text-9xl text-center'>Modern solutions. Timeless design.</h1>
        <h2 className='text-center my-12 text-2xl'>Residential, commercial, and urban planning. Transform spaces into experiences with our comprehensive architectural solutions.</h2>
        <div className="my-4 flex justify-center flex-wrap gap-4">
            {apps.map(([key, { title, city, description, image }], i) => (
                <Boxes
                    key={key}
                    title={title}
                    city={city}
                    description={description}
                    image={image}
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