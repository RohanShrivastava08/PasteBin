import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import { getNowMs } from "@/lib/time";
import type { Paste } from "@/lib/types";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function PastePage({ params }: PageProps) {
  const key = `paste:${params.id}`;
  const paste = (await kv.get<Paste>(key)) ?? null;

  if (!paste) {
    notFound();
  }

  const now = await getNowMs();

  // TTL check
  if (paste.expires_at !== null && now >= paste.expires_at) {
    notFound();
  }

  // View limit check (do NOT increment)
  if (
    paste.max_views !== null &&
    paste.views >= paste.max_views
  ) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
