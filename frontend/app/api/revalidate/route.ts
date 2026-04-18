import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const header = request.headers.get("x-revalidate-secret");
  if (!secret || header !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tag?: string; tags?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // empty body is fine; will revalidate payload tag
  }

  const tags = body.tags ?? (body.tag ? [body.tag] : ["payload"]);
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tags });
}
