import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { getNowMs } from "@/lib/time";
import type { Paste } from "@/lib/types";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  const key = `paste:${params.id}`;

  const paste = (await kv.get<Paste>(key)) ?? null;

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now = await getNowMs();

  // Check TTL
  if (paste.expires_at !== null && now >= paste.expires_at) {
    await kv.del(key);
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // Check view limit BEFORE increment
  if (
    paste.max_views !== null &&
    paste.views >= paste.max_views
  ) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  // Increment views atomically
  const updated = await kv.hincrby(key, "views", 1);

  // Safety check AFTER increment
  if (
    paste.max_views !== null &&
    updated > paste.max_views
  ) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  const remaining_views =
    paste.max_views === null
      ? null
      : Math.max(paste.max_views - updated, 0);

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    },
    { status: 200 }
  );
}
