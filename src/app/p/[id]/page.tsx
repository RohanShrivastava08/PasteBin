import { redis } from "@/lib/redis";
import { notFound } from "next/navigation";
import { getNowMs } from "@/lib/time";
import type { Paste } from "@/lib/types";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = (await redis.get<Paste>(`paste:${params.id}`)) ?? null;

  if (!paste) notFound();

  const now = await getNowMs();

  if (paste.expires_at !== null && now >= paste.expires_at) notFound();
  if (paste.max_views !== null && paste.views >= paste.max_views) notFound();

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {paste.content}
      </pre>
    </main>
  );
}
