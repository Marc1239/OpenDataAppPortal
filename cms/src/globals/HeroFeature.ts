import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate-frontend";

export const HeroFeature: GlobalConfig = {
  slug: "heroFeature",
  label: "Start-Hero",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(["hero"])] },
  fields: [
    { name: "kicker", type: "text", admin: { description: "Kleiner Label-Text über der Headline." } },
    { name: "headline", type: "text", required: true },
    { name: "body", type: "textarea" },
    { name: "featuredApp", type: "relationship", relationTo: "apps" },
    {
      name: "primaryCTA",
      type: "group",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
  ],
};
