import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../hooks/revalidate-frontend";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "icon"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateCollection(["categories", "apps"])],
    afterDelete: [revalidateCollectionOnDelete(["categories", "apps"])],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Wird automatisch aus dem Namen erzeugt." },
      hooks: {
        beforeValidate: [
          ({ data, value }) => value || (data?.name ? slugify(String(data.name)) : undefined),
        ],
      },
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Lucide icon name (z. B. 'Leaf', 'Bike', 'Utensils').",
      },
    },
    { name: "description", type: "textarea" },
  ],
};
