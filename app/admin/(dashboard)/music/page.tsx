import MusicMover from "@/components/admin/music-mover";
import { readConnections } from "@/lib/music/session";

export const metadata = { title: "Music mover" };
// The connection state lives in a cookie, so this page can never be cached.
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  google_denied: "YouTube access was declined.",
  spotify_denied: "Spotify access was declined.",
  google_state: "That YouTube sign-in expired — please try again.",
  spotify_state: "That Spotify sign-in expired — please try again.",
  google_failed: "Couldn't finish connecting YouTube.",
  spotify_failed: "Couldn't finish connecting Spotify.",
};

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; connected?: string }>;
}) {
  const [connections, params] = await Promise.all([readConnections(), searchParams]);
  const message = params.error ? ERRORS[params.error] ?? "Connecting failed." : null;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-light text-charcoal">YouTube → Spotify</h1>
      <p className="mb-8 max-w-2xl text-sm text-stone">
        Copies the songs out of a YouTube playlist into Spotify. Videos that aren&apos;t music —
        and hour-long mixes or full albums — are left behind. Every match is shown before
        anything is written.
      </p>

      {message && (
        <p className="mb-6 border border-[#d9b4ae] bg-[#f9efee] px-4 py-3 text-sm text-[#8c4a41]">
          {message}
        </p>
      )}

      <MusicMover
        initial={{
          google: connections.google ? { label: connections.google.label } : null,
          spotify: connections.spotify ? { label: connections.spotify.label } : null,
        }}
      />
    </div>
  );
}
