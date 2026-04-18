import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

async function callRevalidate(tags: string[]) {
  const url = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(`${url.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tags }),
    });
  } catch (err) {
    console.warn("[revalidate-frontend] failed:", err);
  }
}

export const revalidateCollection =
  (tags: string[]): CollectionAfterChangeHook =>
  async ({ doc }) => {
    const extraTags =
      "slug" in doc && typeof doc.slug === "string" ? [`app:${doc.slug}`] : [];
    await callRevalidate([...tags, ...extraTags, "payload"]);
    return doc;
  };

export const revalidateCollectionOnDelete =
  (tags: string[]): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    const extraTags =
      doc && typeof doc === "object" && "slug" in doc && typeof doc.slug === "string"
        ? [`app:${doc.slug}`]
        : [];
    await callRevalidate([...tags, ...extraTags, "payload"]);
    return doc;
  };

export const revalidateGlobal =
  (tags: string[]): GlobalAfterChangeHook =>
  async ({ doc }) => {
    await callRevalidate([...tags, "payload"]);
    return doc;
  };
