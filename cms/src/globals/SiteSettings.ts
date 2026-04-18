import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate-frontend";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "Site-Einstellungen",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(["settings"])] },
  fields: [
    { name: "siteName", type: "text", defaultValue: "Open Data App Portal" },
    { name: "tagline", type: "text" },
    { name: "seoDescription", type: "textarea" },
    {
      name: "nav",
      type: "array",
      labels: { singular: "Nav-Item", plural: "Navigation" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      labels: { singular: "Footer-Link", plural: "Footer-Links" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
