import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CONTENT_TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
};

function contentTypeFor(filename: string) {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Never expose the underlying storage URL to the client — only signed-in
  // users may stream audio, and they always go through this app-controlled
  // endpoint rather than a directly shareable link.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const episode = await prisma.episode.findUnique({ where: { id } });
  if (!episode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const range = request.headers.get("range") ?? undefined;

  // Local dev fallback: file lives under /public/uploads.
  if (episode.audioUrl.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", episode.audioUrl);
    const { size } = await stat(filePath);
    const contentType = contentTypeFor(filePath);

    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range);
      const start = match ? parseInt(match[1], 10) : 0;
      const end = match && match[2] ? parseInt(match[2], 10) : size - 1;
      const buffer = await readFile(filePath);
      const chunk = buffer.subarray(start, end + 1);

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(chunk.length),
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
      },
    });
  }

  // Production: proxy the request to Blob storage server-side, forwarding
  // Range so the audio player can still seek, without ever handing the
  // client the actual Blob URL.
  const upstream = await fetch(episode.audioUrl, {
    headers: range ? { range } : undefined,
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Failed to load audio" }, { status: 502 });
  }

  const headers = new Headers();
  const passthroughHeaders = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
  ];
  for (const key of passthroughHeaders) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  if (!headers.get("content-type")) {
    headers.set("content-type", contentTypeFor(episode.audioUrl));
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
