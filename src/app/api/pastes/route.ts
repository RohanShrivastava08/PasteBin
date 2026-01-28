import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { generateId } from "@/lib/id";
import { getNowMs } from "@/lib/time";
import type { Paste } from "@/lib/types";

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.content !== "string" || body.content.trim() === "") {
    return NextResponse.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  let expires_at: number | null = null;
  if (body.ttl_seconds !== undefined) {
    if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      return NextResponse.json(
        { error: "ttl_seconds must be >= 1" },
        { status: 400 }
      );
    }
    expires_at = (await getNowMs()) + body.ttl_seconds * 1000;
  }

  let max_views: number | null = null;
  if (body.max_views !== undefined) {
    if (!Number.isInteger(body.max_views) || body.max_views < 1) {
      return NextResponse.json(
        { error: "max_views must be >= 1" },
        { status: 400 }
      );
    }
    max_views = body.max_views;
  }

  const id = generateId();
  const paste: Paste = {
    id,
    content: body.content,
    created_at: await getNowMs(),
    expires_at,
    max_views,
    views: 0,
  };

  await redis.set(`paste:${id}`, paste);

  return NextResponse.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
