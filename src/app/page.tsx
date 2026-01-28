"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const body: any = { content };

    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
      } else {
        setResult(data.url);
        setContent("");
        setTtl("");
        setMaxViews("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 700 }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%", marginBottom: "1rem" }}
          placeholder="Paste your text here..."
        />

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="number"
            min="1"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            style={{ marginRight: "1rem" }}
          />

          <input
            type="number"
            min="1"
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {result && (
        <p style={{ marginTop: "1rem" }}>
          Shareable URL:{" "}
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          {error}
        </p>
      )}
    </main>
  );
}
