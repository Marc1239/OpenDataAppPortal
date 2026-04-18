import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
  revalidateGlobal,
} from "../src/hooks/revalidate-frontend";

const FRONTEND = "http://frontend.test";
const SECRET = "topsecret";

const fetchMock = vi.fn();

beforeEach(() => {
  process.env.FRONTEND_URL = FRONTEND;
  process.env.REVALIDATE_SECRET = SECRET;
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function lastCall() {
  const call = fetchMock.mock.calls.at(-1);
  if (!call) throw new Error("fetch was not called");
  const [url, init] = call as [string, RequestInit];
  return {
    url,
    headers: init.headers as Record<string, string>,
    body: JSON.parse(String(init.body)) as { tags: string[] },
  };
}

describe("revalidateCollection", () => {
  it("POSTs to the frontend revalidate endpoint with the shared secret", async () => {
    const hook = revalidateCollection(["apps"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", slug: "my-app" } });
    const call = lastCall();
    expect(call.url).toBe(`${FRONTEND}/api/revalidate`);
    expect(call.headers["x-revalidate-secret"]).toBe(SECRET);
    expect(call.headers["Content-Type"]).toBe("application/json");
  });

  it("includes the collection tags, the app:<slug> tag, and the 'payload' tag", async () => {
    const hook = revalidateCollection(["apps"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", slug: "dresden-app" } });
    const { body } = lastCall();
    expect(body.tags).toEqual(["apps", "app:dresden-app", "payload"]);
  });

  it("omits the app:<slug> tag when the doc has no slug", async () => {
    const hook = revalidateCollection(["categories"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", name: "Mobilität" } });
    const { body } = lastCall();
    expect(body.tags).toEqual(["categories", "payload"]);
  });

  it("strips a trailing slash from FRONTEND_URL", async () => {
    process.env.FRONTEND_URL = `${FRONTEND}/`;
    const hook = revalidateCollection(["apps"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", slug: "x" } });
    expect(lastCall().url).toBe(`${FRONTEND}/api/revalidate`);
  });

  it("skips the network call when FRONTEND_URL or REVALIDATE_SECRET is missing", async () => {
    delete process.env.FRONTEND_URL;
    const hook = revalidateCollection(["apps"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", slug: "x" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows network errors so CMS writes aren't blocked", async () => {
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const hook = revalidateCollection(["apps"]);
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (hook as any)({ doc: { id: "1", slug: "x" } }),
    ).resolves.toBeDefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("returns the original doc (payload hook contract)", async () => {
    const hook = revalidateCollection(["apps"]);
    const doc = { id: "1", slug: "x", title: "t" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (hook as any)({ doc });
    expect(result).toBe(doc);
  });
});

describe("revalidateCollectionOnDelete", () => {
  it("sends the tags for a deleted doc with a slug", async () => {
    const hook = revalidateCollectionOnDelete(["apps"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { id: "1", slug: "old-app" } });
    expect(lastCall().body.tags).toEqual(["apps", "app:old-app", "payload"]);
  });
});

describe("revalidateGlobal", () => {
  it("sends only the provided tags plus 'payload'", async () => {
    const hook = revalidateGlobal(["hero"]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (hook as any)({ doc: { headline: "x" } });
    expect(lastCall().body.tags).toEqual(["hero", "payload"]);
  });
});
