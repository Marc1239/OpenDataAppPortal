"use client";
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import Image from 'next/image';
import { calcMetaQuality } from "@/utils/metadata-quality"
import { TagsFilter, UITag } from '@/components/tags-filter'


export interface AppData {
    title: string
    city: string
    category: string
    barrierFree: boolean
    description: string
    metaDataQuality: string
    image: string
    tags: string[]
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
    const [selectedTags, setSelectedTags] = React.useState<UITag[]>([]);

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

    React.useEffect(() => {
      const st = localStorage.getItem("selectedTags");
      if (st) {
        try { setSelectedTags(JSON.parse(st)); } catch {}
      }
    }, []);
    React.useEffect(() => {
      localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
    }, [selectedTags]);
  
  const apps = React.useMemo<AppEntry[]>(() => {
    return Object.entries(appsDresdenData).map(([key, data]) => {
      const slug = key.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "")
      const meta = calcMetaQuality(data as Record<string, unknown>)
      const d = data as Omit<AppData, "metaDataQuality" | "tags"> & { tags?: string[] }
      return {
        key,
        slug,
        data: {
          ...d,
          tags: Array.isArray(d.tags) ? d.tags : [],  
          metaDataQuality: meta,
        }
      }
    })
  }, [])

  const tagSuggestions = React.useMemo(() => {
    const uniq = new Set<string>();
    apps.forEach(a => (a.data.tags || []).forEach(t => uniq.add(t)));
    return Array.from(uniq).sort((a,b)=>a.localeCompare(b)).map(t => ({
      id: t.toLowerCase(),
      label: t,
    }));
  }, [apps]);


  const filteredApps = React.useMemo(() => {
    return apps.filter(({ data }) => {
      if (selectedCity && data.city !== selectedCity) return false
      if (selectedCategory && data.category !== selectedCategory) return false

      if (selectedMetaDataQuality) {
        const n = parseInt(String(data.metaDataQuality).replace("%",""), 10)
        const rounded = `${Math.min(100, Math.max(0, Math.round(n/10)*10))}%`
        if (rounded !== selectedMetaDataQuality) return false
      }

      if (accessibleOnly && !data.barrierFree) return false

      // Tags-Filter (OR-Logik)
      if (selectedTags.length > 0) {
        const wanted = new Set(selectedTags.map(t => t.id.toLowerCase()));
        const appTags = (data.tags || []).map(t => t.toLowerCase());
        const hasAny = appTags.some(t => wanted.has(t));
        if (!hasAny) return false;
        // Für AND-Logik stattdessen:
        // const hasAll = Array.from(wanted).every(w => appTags.includes(w));
        // if (!hasAll) return false;
      }

      return true
    })
  }, [apps, selectedCity, selectedCategory, selectedMetaDataQuality, accessibleOnly, selectedTags])
    
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
            <TagsFilter
              value={selectedTags}
              onChange={setSelectedTags}
              suggestions={tagSuggestions}   
              maxTags={5}
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
                setSelectedTags([])
                localStorage.removeItem("selectedCity");
                localStorage.removeItem("selectedCategory");
                localStorage.removeItem("selectedMetaDataQuality");
                localStorage.setItem("accessibleOnly", "false");
                localStorage.removeItem("selectedTags");
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
                    tags={data.tags ?? []}
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
        <CardCurtainReveal onClick={() => router.push(`/dashboard/appview/${(id)}`)} className="h-[560px] cursor-pointer w-auto max-w-[400px] border-0 rounded-md hover:shadow-primary/50 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-primary/50 to-stone-50 text-zinc-950">
        <CardCurtainRevealBody className="h-1/2">
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

        <CardCurtainRevealFooter className="h-1/2 relative">
          <Image
            fill
            alt={title}
            className="object-cover"
            src={image}
          />
        </CardCurtainRevealFooter>
      </CardCurtainReveal>
    )
}