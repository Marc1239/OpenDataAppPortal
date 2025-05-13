"use client";
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  } from '@/components/ui/card'
import { CardCurtain, CardCurtainReveal, CardCurtainRevealBody, CardCurtainRevealDescription, CardCurtainRevealFooter, CardCurtainRevealTitle } from '@/components/ui/card-curtain-reveal'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import appsDresdenData from "../../data/apps_dresden.json"
import { ComboboxCity } from '@/components/comboboxCity'
import { ComboboxCategory } from '@/components/comboboxCategory';
import { Checkbox } from '@/components/ui/checkbox'
import { Trash } from 'lucide-react'


export interface AppData {
    title: string
    city: string
    category: string
    barrierFree: boolean
    description: string
    image: string
  }


export interface AppEntry {
    key: string
    data: AppData
  }


  const AppView: React.FC = () => {

    const [selectedCity, setSelectedCity] = React.useState<string>("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("");
    const [accessibleOnly, setAccessibleOnly] = React.useState<boolean>(false);

    React.useEffect(() => {
      const sc = localStorage.getItem("selectedCity");
      if (sc) setSelectedCity(sc);
  
      const cat = localStorage.getItem("selectedCategory");
      if (cat) setSelectedCategory(cat);
  
      const ao = localStorage.getItem("accessibleOnly");
      if (ao !== null) setAccessibleOnly(ao === "true");
    }, []);

    React.useEffect(() => {
      localStorage.setItem("selectedCity", selectedCity);
    }, [selectedCity]);
  
    React.useEffect(() => {
      localStorage.setItem("selectedCategory", selectedCategory);
    }, [selectedCategory]);
  
    React.useEffect(() => {
      localStorage.setItem("accessibleOnly", String(accessibleOnly));
    }, [accessibleOnly]);
  
  const apps = React.useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => ({
      key,
      data: data as AppData ,
    }))
  }, [])


  const filteredApps = React.useMemo(() => {
    return apps.filter(({ data }) => {
      if (selectedCity && data.city !== selectedCity) return false
      if (selectedCategory && data.category !== selectedCategory) return false
      if (accessibleOnly && !data.barrierFree) return false
      return true
    })
  }, [apps, selectedCity, selectedCategory, accessibleOnly])
  
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        {/*<Badge className='w-fit text-xl'>Unsere Apps</Badge>*/}
        {/*<h1 className='text-9xl text-center'>Modern solutions. Timeless design.</h1>*/}
        <div className='w-full h-24 flex gap-4 items-center'>
            <ComboboxCity 
                value={selectedCity}
                onValueChange={setSelectedCity}
            />
            <ComboboxCategory
                value={selectedCategory}
                onValueChange={setSelectedCategory}
            />
            <div className='flex items-center gap-2'>
                <Checkbox 
                    checked={accessibleOnly}
                    onCheckedChange={(val) => setAccessibleOnly(!!val)}
                />
                <p>Barrierefrei</p>
            </div>
            <Button
              className="ml-auto"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCity("")
                setSelectedCategory("")
                setAccessibleOnly(false)  
                localStorage.removeItem("selectedCity");
                localStorage.removeItem("selectedCategory");
                localStorage.setItem("accessibleOnly", "false");
              }}
            >
              <Trash />
            </Button>
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
                    category={data.category}
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