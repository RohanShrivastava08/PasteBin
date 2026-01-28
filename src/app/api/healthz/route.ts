import { NextResponse } from "next/server";
import { checkKvConnection } from "@/lib/kv";

export async function GET() {
  const kvOk = await checkKvConnection();

  if (!kvOk) {
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true },
    { status: 200 }
  );
}
