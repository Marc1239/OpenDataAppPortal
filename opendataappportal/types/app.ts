export type UITag = { 
  id: string; 
  label: string; 
};

export interface AppData {
  title: string;
  city: string;
  category: string;
  barrierFree: boolean;
  description: string;
  metaDataQuality: string;
  image: string;
  tags: string[];
}

export interface AppEntry {
  key: string;
  slug: string;
  data: AppData;
}

export type Filters = {
  city: string;
  category: string;
  meta: string;      
  accessibleOnly: boolean;
  tagIds: string[];  
};

export type FilterBarProps = {
  city: string;
  category: string;
  meta: string;
  accessibleOnly: boolean;
  selectedTags: UITag[];
  suggestions: UITag[];

  onCity: (v: string) => void;
  onCategory: (v: string) => void;
  onMeta: (v: string) => void;
  onAccessible: (v: boolean) => void;
  onTags: (v: UITag[]) => void;
  onReset: () => void;
};

export type BoxesProps = { 
  id: string 
} & Pick<AppData, "title" | "description" | "image">;