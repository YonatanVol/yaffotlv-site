import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/music/api";
import { readConnections } from "@/lib/music/session";

/** Which accounts are linked, for the page header. Never returns any token. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const connections = await readConnections();
  return NextResponse.json({
    google: connections.google ? { label: connections.google.label } : null,
    spotify: connections.spotify ? { label: connections.spotify.label } : null,
  });
}
