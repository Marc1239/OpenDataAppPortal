import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Apps } from "./collections/Apps";
import { HeroFeature } from "./globals/HeroFeature";
import { ContactInfo } from "./globals/ContactInfo";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3001",
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— Open Data App Portal CMS",
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Categories, Tags, Apps],
  globals: [HeroFeature, ContactInfo, SiteSettings],
  secret: process.env.PAYLOAD_SECRET || "change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? "mongodb://localhost:27017/opendata",
  }),
  cors: [
    process.env.FRONTEND_URL ?? "http://localhost:3000",
    process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3001",
  ],
  csrf: [
    process.env.FRONTEND_URL ?? "http://localhost:3000",
    process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3001",
  ],
  upload: {
    limits: { fileSize: 20 * 1024 * 1024 },
  },
});
