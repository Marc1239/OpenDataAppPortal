import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate-frontend";

export const ContactInfo: GlobalConfig = {
  slug: "contactInfo",
  label: "Kontakt",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(["contact"])] },
  fields: [
    { name: "headline", type: "text" },
    { name: "body", type: "textarea" },
    { name: "email", type: "email" },
    { name: "phone", type: "text" },
    { name: "address", type: "textarea" },
    { name: "hours", type: "textarea" },
  ],
};
