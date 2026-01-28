import redis from "@/lib/redis";
import { notFound } from "next/navigation";
import { getNowMs } from "@/lib/time";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await redis.hGetAll(`paste:${params.id}`);

  if (!data || !data.id) notFound();

  const paste = {
    content: data.content,
    expires_at: data.expires_at ? Number(data.expires_at) : null,
    max_views: data.max_views ? Number(data.max_views) : null,
    views: Number(data.views),
  };

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
