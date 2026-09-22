import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { POSTS_TAG } from '@/lib/payload'

/**
 * On-demand cache purge, called by the Payload CMS webhook on every post
 * create/update/delete. Payload posts
 * `{tenant, collection, op, id, slug, fullPath, status}` with the shared secret in an
 * `x-revalidate-secret` header.
 *
 * The tag purge is the load-bearing half: the intelligence index, the sitemap and every
 * article read one cached fetch of the post list, so purging paths alone would
 * re-render those pages against the same stale list.
 *
 * Fails CLOSED when no secret is configured: an unset secret must never turn this into
 * a free cache-purge endpoint for anyone who finds the URL.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.PAYLOAD_REVALIDATE_SECRET
  const secret =
    req.nextUrl.searchParams.get('secret') || req.headers.get('x-revalidate-secret')
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body: { paths?: string[]; fullPath?: string; slug?: string } = {}
  try {
    body = (await req.json()) as typeof body
  } catch {
    /* no body — the tag purge below still does the useful work */
  }

  const paths = new Set<string>(body.paths ?? [])
  if (paths.size === 0 && (body.fullPath || body.slug)) {
    const path = body.fullPath || `/intelligence/${body.slug}`
    paths.add(path.startsWith('/') ? path : `/${path}`)
  }
  paths.add('/intelligence')
  paths.add('/sitemap.xml')

  // Next 16 requires a cache-life profile; "max" expires every entry carrying the tag.
  revalidateTag(POSTS_TAG, 'max')
  for (const p of paths) revalidatePath(p)

  return NextResponse.json({ ok: true, revalidated: [...paths], tag: POSTS_TAG })
}
