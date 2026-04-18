import type { CollectionConfig } from "payload";
import { slugify } from "../utils/slugify";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../hooks/revalidate-frontend";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "slug"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateCollection(["tags", "apps"])],
    afterDelete: [revalidateCollectionOnDelete(["tags", "apps"])],
  },
  fields: [
    { name: "label", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ data, value }) => value || (data?.label ? slugify(String(data.label)) : undefined),
        ],
      },
    },
  ],
};
