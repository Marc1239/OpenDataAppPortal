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
import { useRouter } from 'next/navigation'
import { ComboboxMetaData } from '@/components/comboboxMetaData';


export interface AppData {
    title: string
    city: string
    category: string
    barrierFree: boolean
    description: string
    //api: string
    //github: boolean
    metaDataQuality: string
    image: string
  }


export interface AppEntry {
    key: string
    slug: string
    data: AppData
  }


  const AppView: React.FC = () => {

    const router = useRouter()

    const [selectedCity, setSelectedCity] = React.useState<string>("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("");
    const [selectedMetaDataQuality, setMetaDataQuality] = React.useState<string>("");
    const [accessibleOnly, setAccessibleOnly] = React.useState<boolean>(false);

    React.useEffect(() => {
      const sc = localStorage.getItem("selectedCity");
      if (sc) setSelectedCity(sc);
  
      const cat = localStorage.getItem("selectedCategory");
      if (cat) setSelectedCategory(cat);

      const meta = localStorage.getItem("selectedMetaDataQuality");
      if (meta) setMetaDataQuality(meta);
  
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
      localStorage.setItem("selectedMetaDataQuality", selectedMetaDataQuality);
    }, [selectedMetaDataQuality]);
  
    React.useEffect(() => {
      localStorage.setItem("accessibleOnly", String(accessibleOnly));
    }, [accessibleOnly]);
  
  const apps = React.useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => {
      const slug = key
       .toLowerCase()
       .replace(/\s+/g, '-')      
       .replace(/[^a-z0-9\-]/g, '')
      return { key, slug, data: data as AppData }
    })
  }, [])


  const filteredApps = React.useMemo(() => {
    return apps.filter(({ data }) => {
      if (selectedCity && data.city !== selectedCity) return false
      if (selectedCategory && data.category !== selectedCategory) return false
      if (selectedMetaDataQuality && data.metaDataQuality !== selectedMetaDataQuality) return false
      if (accessibleOnly && !data.barrierFree) return false
      return true
    })
  }, [apps, selectedCity, selectedCategory, accessibleOnly])
  
  return (
    <div className='w-full flex flex-col justify-center items-center '>
        <div className='w-full h-auto flex flex-wrap gap-4 items-center'>
            <ComboboxCity 
                value={selectedCity}
                onValueChange={setSelectedCity}
            />
            <ComboboxCategory
                value={selectedCategory}
                onValueChange={setSelectedCategory}
            />
            <ComboboxMetaData
                value={selectedMetaDataQuality}
                onValueChange={setMetaDataQuality}
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
                setMetaDataQuality("")
                setAccessibleOnly(false)  
                localStorage.removeItem("selectedCity");
                localStorage.removeItem("selectedCategory");
                localStorage.removeItem("selectedMetaDataQuality");
                localStorage.setItem("accessibleOnly", "false");
              }}
            >
              <Trash />
            </Button>
        </div>
        <div className="my-4 flex justify-center flex-wrap gap-4">
            {filteredApps.map(({ key, slug, data }) => (
                <Boxes
                    id={slug} 
                    key={key}
                    title={data.title}
                    city={data.city}
                    barrierFree={data.barrierFree}
                    description={data.description}
                    metaDataQuality={data.metaDataQuality}
                    image={data.image}
                    category={data.category}
                />
            ))}
        </div>
    </div>
  )
}

export default AppView


interface BoxesProps extends AppData {
  id: string;
}

const Boxes: React.FC<BoxesProps> = ({ id, title, description, image }) => {
    
    const router = useRouter()
    
    return (
        <CardCurtainReveal onClick={() => router.push(`/dashboard/appview/${(id)}`)} className="h-[560px] cursor-pointer w-auto max-w-[400px] border rounded-md border-zinc-100 bg-gradient-to-br from-primary to-stone-50 text-zinc-950 shadow">
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