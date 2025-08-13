"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import {
  CardCurtain,
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealDescription,
  CardCurtainRevealFooter,
  CardCurtainRevealTitle,
} from "@/components/ui/card-curtain-reveal";
import * as React from "react";
import { BoxesProps } from "@/types/app";



function BoxesBase({ id, title, description, image }: BoxesProps) {
  const router = useRouter();
  return (
    <CardCurtainReveal
      onClick={() => router.push(`/dashboard/appview/${id}`)}
      className="h-[560px] cursor-pointer w-auto max-w-[400px] border-0 rounded-md hover:shadow-primary/50 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-primary/50 to-stone-50 text-zinc-950"
    >
      <CardCurtainRevealBody className="h-1/2">
        <CardCurtainRevealTitle className="text-3xl font-medium tracking-tight">
          {title}
        </CardCurtainRevealTitle>
        <CardCurtainRevealDescription className="my-4">
          <p>{description}</p>
        </CardCurtainRevealDescription>
        <div className="aspect-square rounded-full bg-white/80 p-2 inline-flex">
          <ArrowUpRight />
        </div>
        <CardCurtain className="bg-slate-50" />
      </CardCurtainRevealBody>

      <CardCurtainRevealFooter className="h-1/2 relative">
        <Image fill alt={title} className="object-cover" src={image} />
      </CardCurtainRevealFooter>
    </CardCurtainReveal>
  );
}

export default React.memo(BoxesBase);
