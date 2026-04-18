import { cn } from "@/lib/utils";

type LexicalNode =
  | { type: "text"; text: string; format?: number }
  | { type: "paragraph"; children?: LexicalNode[] }
  | { type: "heading"; tag?: string; children?: LexicalNode[] }
  | { type: "list"; listType?: string; children?: LexicalNode[] }
  | { type: "listitem"; children?: LexicalNode[] }
  | { type: "link"; fields?: { url?: string }; url?: string; children?: LexicalNode[] }
  | { type: "linebreak" }
  | { type: string; children?: LexicalNode[]; [key: string]: unknown };

function renderTextNode(node: LexicalNode, key: number): React.ReactNode {
  if (node.type !== "text") return null;
  const format: number = "format" in node ? ((node as { format?: number }).format ?? 0) : 0;
  let content: React.ReactNode = (node as { text: string }).text;
  if (format & 1) content = <strong key={`b${key}`}>{content}</strong>;
  if (format & 2) content = <em key={`i${key}`}>{content}</em>;
  if (format & 8) content = <u key={`u${key}`}>{content}</u>;
  if (format & 16) content = <code key={`c${key}`}>{content}</code>;
  return <span key={key}>{content}</span>;
}

function renderChildren(children?: LexicalNode[]): React.ReactNode[] {
  if (!children) return [];
  return children.map((child, i) => renderNode(child, i));
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case "text":
      return renderTextNode(node, key);
    case "linebreak":
      return <br key={key} />;
    case "paragraph":
      return (
        <p key={key} className="my-3">
          {renderChildren(node.children)}
        </p>
      );
    case "heading": {
      const tag = (node as { tag?: string }).tag ?? "h3";
      const Tag = tag as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key} className="mt-6 mb-3 font-[var(--font-display)] font-semibold">
          {renderChildren(node.children)}
        </Tag>
      );
    }
    case "list": {
      const listType = (node as { listType?: string }).listType ?? "bullet";
      const Tag = listType === "number" ? "ol" : "ul";
      return (
        <Tag
          key={key}
          className={cn(
            "my-3 pl-6",
            listType === "number" ? "list-decimal" : "list-disc",
          )}
        >
          {renderChildren(node.children)}
        </Tag>
      );
    }
    case "listitem":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "link": {
      const url =
        (node as { fields?: { url?: string } }).fields?.url ??
        (node as { url?: string }).url ??
        "#";
      return (
        <a
          key={key}
          href={url}
          className="text-primary underline hover:no-underline"
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {renderChildren(node.children)}
        </a>
      );
    }
    default:
      return (
        <span key={key}>
          {renderChildren((node as { children?: LexicalNode[] }).children)}
        </span>
      );
  }
}

export function RichText({
  content,
  className,
  fallback,
}: {
  content: unknown;
  className?: string;
  fallback?: string;
}) {
  if (!content) {
    return fallback ? (
      <p className={cn("text-base leading-relaxed", className)}>{fallback}</p>
    ) : null;
  }
  if (typeof content === "string") {
    return <p className={cn("text-base leading-relaxed", className)}>{content}</p>;
  }
  const root = (content as { root?: { children?: LexicalNode[] } }).root;
  if (!root?.children) {
    return fallback ? (
      <p className={cn("text-base leading-relaxed", className)}>{fallback}</p>
    ) : null;
  }
  return (
    <div className={cn("text-base leading-relaxed", className)}>
      {renderChildren(root.children)}
    </div>
  );
}
