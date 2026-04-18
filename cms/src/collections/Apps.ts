import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { slugify } from "../utils/slugify";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../hooks/revalidate-frontend";

export const Apps: CollectionConfig = {
  slug: "apps",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "city", "isFeatured", "updatedAt"],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateCollection(["apps"])],
    afterDelete: [revalidateCollectionOnDelete(["apps"])],
  },
  fields: [
    { name: "title", type: "text", required: true, index: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Wird automatisch aus dem Titel erzeugt." },
      hooks: {
        beforeValidate: [
          ({ data, value }) =>
            value || (data?.title ? slugify(String(data.title)) : undefined),
        ],
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "city",
          type: "text",
          required: false,
          admin: { width: "50%" },
        },
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          required: false,
          admin: { width: "50%" },
        },
      ],
    },
    { name: "tags", type: "relationship", relationTo: "tags", hasMany: true },
    {
      name: "shortDescription",
      type: "textarea",
      required: true,
      admin: { description: "Kurzer Teaser-Text (max. 280 Zeichen empfohlen)." },
    },
    {
      name: "longDescription",
      type: "richText",
      editor: lexicalEditor({}),
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Hauptbild der App (Hochkant oder Querformat)." },
    },
    {
      name: "heroImageURL",
      type: "text",
      admin: {
        description:
          "Optionale externe Bild-URL (wird nur genutzt, wenn kein heroImage gesetzt ist).",
      },
    },
    {
      name: "screenshots",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "barrierFree", type: "checkbox", defaultValue: false, admin: { width: "50%" } },
        { name: "isFeatured", type: "checkbox", defaultValue: false, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "publishDate", type: "text", admin: { width: "33%", description: "z. B. '2023' oder '14.08.2019'" } },
        { name: "latestRelease", type: "text", admin: { width: "33%" } },
        {
          name: "metadataQualityOverride",
          type: "number",
          min: 0,
          max: 100,
          admin: { width: "33%", description: "Leer lassen für Auto-Berechnung." },
        },
      ],
    },
    { name: "publishInformation", type: "textarea" },
    {
      name: "links",
      type: "group",
      fields: [
        { name: "website", type: "text" },
        { name: "appleAppStore", type: "text" },
        { name: "googlePlay", type: "text" },
        { name: "github", type: "text" },
        { name: "api", type: "text" },
        { name: "downloadLink", type: "text" },
        { name: "reportBug", type: "text" },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "publisherMail", type: "email" },
        { name: "supportMail", type: "email" },
      ],
    },
  ],
};
