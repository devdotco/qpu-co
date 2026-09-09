import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * How long the edge may hold a page.
   *
   * Next sends `s-maxage=31536000` on a fully prerendered page — a year — and
   * this zone's Cloudflare rule ("Cache marketing HTML at the edge") is
   * `edge_ttl: respect_origin`. Together they make a deploy invisible: the
   * container serves the new page and the edge keeps serving the old one, and a
   * hard refresh does not help because the stale copy is the edge object rather
   * than the browser's. Only a manual purge clears it, and a stored TTL cannot
   * be shortened retroactively — so the header has to be right *before* the
   * purge, or the purge simply caches another year-long copy.
   *
   * Five minutes plus a year of stale-while-revalidate: the edge still absorbs
   * effectively all the traffic and nobody waits on an origin render, but a
   * deploy reaches people on its own. Hashed assets under `/_next/static` and
   * `/_next/image` are excluded and keep their long TTL.
   *
   * If a stale page ever needs diagnosing: `cf-cache-status` reports `DYNAMIC`
   * while the edge is demonstrably serving a stale page, so it is no help. What
   * settles it is a request straight at the origin IP.
   */
  async headers() {
    return [
      {
        source: "/:path((?!_next/static|_next/image).*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=31535700" },
        ],
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
