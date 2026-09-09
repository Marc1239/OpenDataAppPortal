export function richTextToText(content: unknown, fallback: string): string {
  if (typeof content === "string") return content;
  if (!content || typeof content !== "object") return fallback;
  const root = content as { root?: { children?: unknown[] } };
  const children = root?.root?.children;
  if (!Array.isArray(children)) return fallback;
  const texts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { text?: string; children?: unknown[] };
    if (typeof n.text === "string") texts.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  children.forEach(walk);
  const combined = texts.join(" ").trim();
  return combined || fallback;
}
