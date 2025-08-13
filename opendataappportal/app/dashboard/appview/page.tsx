"use client";

import * as React from "react";
import appsDresdenData from "@/app/data/apps_dresden.json";
import { toEntries } from "@/lib/filterHelper";
import { useAppFilters } from "@/hooks/useFilters";
import FiltersBar from "@/components/FiltersBar";
import Boxes from "@/components/Boxes";
import { AppEntry } from "@/types/app";

const AppView: React.FC = () => {
  const apps = React.useMemo<AppEntry[]>(() => toEntries(appsDresdenData as any), []);
  const {
    city, category, meta, accessibleOnly, selectedTags,
    setCity, setCategory, setMeta, setAccessibleOnly, setSelectedTags,
    suggestions, filtered, resetAll
  } = useAppFilters(apps);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full">
        <FiltersBar
          city={city}
          category={category}
          meta={meta}
          accessibleOnly={accessibleOnly}
          selectedTags={selectedTags}
          suggestions={suggestions}
          onCity={setCity}
          onCategory={setCategory}
          onMeta={setMeta}
          onAccessible={setAccessibleOnly}
          onTags={setSelectedTags}
          onReset={resetAll}
        />
      </div>

      <div className="my-4 flex justify-center flex-wrap gap-4">
        {filtered.map(({ key, slug, data }) => (
          <Boxes
            id={slug}
            key={key}
            title={data.title}
            description={data.description}
            image={data.image}
          />
        ))}
      </div>
    </div>
  );
};

export default AppView;