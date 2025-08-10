// components/integration-pills.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

type IntegrationPillsProps = {
  tags?: string[];
  className?: string;
};

export default function IntegrationPills({ tags = [], className }: IntegrationPillsProps) {
  const items = tags.length ? tags : ["Ohne Tags"];

  return (
    <div className={cn("flex justify-center py-5", className)}>
      <div className="group flex w-full max-w-lg flex-wrap justify-center transition-all duration-300 ease-in-out">
        {items.map((name) => (
          <div
            key={name}
            className={cn(
              "m-1 transform text-nowrap cursor-pointer rounded-full border-2 border-gray-400 bg-white px-6 py-2 text-sm md:text-base text-black transition-transform duration-300 ease-in-out",
              "group-hover:border-primary group-hover:scale-75 group-hover:text-primary group-hover:bg-white group-hover:border-2"
            )}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
