import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

const SECRET = "test-secret";

beforeEach(() => {
  process.env.REVALIDATE_SECRET = SECRET;
  revalidateTag.mockReset();
});

function makeRequest(body: unknown, headerSecret?: string): Request {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (headerSecret !== undefined) {
    headers["x-revalidate-secret"] = headerSecret;
  }
  return new Request("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  it("rejects requests without the shared secret", async () => {
    const { POST } = await import("../app/api/revalidate/route");
    const res = await POST(makeRequest({ tags: ["apps"] }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects requests with the wrong secret", async () => {
    const { POST } = await import("../app/api/revalidate/route");
    const res = await POST(makeRequest({ tags: ["apps"] }, "nope"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates all tags from the tags[] body", async () => {
    const { POST } = await import("../app/api/revalidate/route");
    const res = await POST(
      makeRequest({ tags: ["apps", "app:x"] }, SECRET),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("apps", "max");
    expect(revalidateTag).toHaveBeenCalledWith("app:x", "max");
    const json = (await res.json()) as { revalidated: boolean; tags: string[] };
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(["apps", "app:x"]);
  });

  it("accepts a single tag field", async () => {
    const { POST } = await import("../app/api/revalidate/route");
    const res = await POST(makeRequest({ tag: "apps" }, SECRET));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("apps", "max");
  });

  it("defaults to revalidating 'payload' when body is empty", async () => {
    const { POST } = await import("../app/api/revalidate/route");
    const req = new Request("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": SECRET,
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("payload", "max");
  });
});
