import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { getNowMs } from "@/lib/time";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const data = await redis.hGetAll(key);

  if (!data || !data.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paste = {
    id: data.id,
    content: data.content,
    created_at: Number(data.created_at),
    expires_at: data.expires_at ? Number(data.expires_at) : null,
    max_views: data.max_views ? Number(data.max_views) : null,
    views: Number(data.views),
  };

  const now = await getNowMs();

  if (paste.expires_at !== null && now >= paste.expires_at) {
    await redis.del(key);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  const views = await redis.hIncrBy(key, "views", 1);

  if (paste.max_views !== null && views > paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - views, 0),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
