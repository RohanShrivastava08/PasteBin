import { kv } from "@vercel/kv";

export async function checkKvConnection(): Promise<boolean> {
  try {
    await kv.ping();
    return true;
  } catch (error) {
    console.error("KV connection failed", error);
    return false;
  }
}
