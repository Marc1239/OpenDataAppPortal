import type { Metadata } from "next";
import { getCategories } from "@/lib/payload";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "App einreichen",
  description: "Reiche deine Open-Data-App für den Katalog ein.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function EinreichenPage() {
  const categories = await getCategories();
  return <SubmitForm categories={categories.map((c) => c.name)} />;
}
