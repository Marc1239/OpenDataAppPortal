import * as React from "react";
import { useLocalStorage } from "./useLocalStorage";
import { AppEntry } from "@/types/app";
import { filterApps, makeTagSuggestions } from "@/lib/filterHelper";
import { Filters, UITag } from "@/types/app";


export function useAppFilters(apps: AppEntry[]) {
  const [city, setCity, resetCity] = useLocalStorage<string>("selectedCity", "");
  const [category, setCategory, resetCategory] = useLocalStorage<string>("selectedCategory", "");
  const [meta, setMeta, resetMeta] = useLocalStorage<string>("selectedMetaDataQuality", "");
  const [accessibleOnly, setAccessibleOnly, resetAccessible] = useLocalStorage<boolean>("accessibleOnly", false);
  const [selectedTags, setSelectedTags, resetTags] = useLocalStorage<UITag[]>("selectedTags", []);

  const suggestions = React.useMemo(() => makeTagSuggestions(apps), [apps]);

  const filters: Filters = React.useMemo(() => ({
    city,
    category,
    meta,
    accessibleOnly,
    tagIds: selectedTags.map(t => t.id.toLowerCase()),
  }), [city, category, meta, accessibleOnly, selectedTags]);

  const filtered = React.useMemo(() => filterApps(apps, filters), [apps, filters]);

  const resetAll = React.useCallback(() => {
    resetCity(); resetCategory(); resetMeta(); resetAccessible(); resetTags();
  }, [resetCity, resetCategory, resetMeta, resetAccessible, resetTags]);

  return {
    city, category, meta, accessibleOnly, selectedTags,
    setCity, setCategory, setMeta, setAccessibleOnly, setSelectedTags,
    suggestions, filtered,
    resetAll,
  };
}
