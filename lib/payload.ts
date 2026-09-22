/**
 * QPU.co intelligence articles published through the shared Payload CMS
 * (payload.dev.co, tenant 42).
 *
 * The site's own seed articles are Markdown-ish strings rendered by
 * <ArticleContent>. CMS posts are not: they are sanitized HTML carrying inline SVG
 * charts, so they arrive as `contentHtml` and the page renders them directly. Both
 * kinds live side by side in getArticles(), which is exactly what the data layer was
 * designed for — "replace the body of any function with a fetch and the rest of the app
 * continues to work unchanged".
 */
import type { Article, ArticleCategory } from '@/types'

/** Cache tag purged by app/api/revalidate/route.ts when Payload fires its webhook. */
export const POSTS_TAG = 'qpu-posts'

const API = process.env.PAYLOAD_API ?? 'https://payload.dev.co/api'
const TENANT = Number(process.env.PAYLOAD_TENANT_ID ?? 42)

/** Ceiling on staleness if the webhook never arrives (bad secret, dead delivery). */
const REVALIDATE_SECONDS = 900

export type CmsAuthor = { name: string; jobTitle: string | null; biography: string | null }

/** An Article that came from the CMS carries HTML and a full author record. */
export type CmsArticle = Article & {
  contentHtml: string
  featuredImage: { url: string; alt: string | null } | null
  cmsAuthor: CmsAuthor | null
}

export const isCmsArticle = (a: Article): a is CmsArticle =>
  typeof (a as CmsArticle).contentHtml === 'string' && (a as CmsArticle).contentHtml.length > 0

const isObj = <T,>(v: T | number | null | undefined): v is T => typeof v === 'object' && v !== null

const CATEGORIES: ArticleCategory[] = ['hardware', 'research', 'business', 'benchmarks', 'software', 'policy']

/** The CMS category is free text; anything unrecognised becomes "research". */
function toCategory(name: string | undefined): ArticleCategory {
  const n = (name ?? '').toLowerCase()
  return CATEGORIES.find((c) => n.includes(c)) ?? 'research'
}

const readingMinutes = (html: string): number =>
  Math.max(1, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 225))

const QUERY =
  `posts?where[tenant][equals]=${TENANT}` +
  '&where[_status][equals]=published' +
  '&depth=1&limit=200&sort=-publishedAt'

export async function getCmsArticles(): Promise<CmsArticle[]> {
  let res: Response
  try {
    res = await fetch(`${API}/${QUERY}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: [POSTS_TAG] },
    })
  } catch {
    // The rest of the site does not depend on the CMS, so a blip must not take it down.
    return []
  }
  if (!res.ok) return []

  const { docs } = (await res.json()) as { docs: Record<string, unknown>[] }

  return docs
    .filter((d) => d._status === 'published' && d.bodyHtml && !d.excludeFromApi)
    .map((d) => {
      const html = String(d.bodyHtml ?? '')
      const img = d.featuredImage as { url?: string; alt?: string } | number | null
      const author = ((d.authors as (CmsAuthor | number)[]) ?? []).find(isObj<CmsAuthor>) ?? null
      const cat = d.primaryCategory as { name?: string } | number | null
      return {
        id: `cms-${d.id as number}`,
        slug: String(d.slug ?? ''),
        title: String(d.title ?? ''),
        dek: String(d.excerpt ?? ''),
        excerpt: String(d.excerpt ?? ''),
        author: author?.name ?? 'QPU.co',
        publishedAt: String(d.publishedAt ?? d.createdAt ?? ''),
        updatedAt: (d.updatedAt as string) ?? null,
        readingTime: readingMinutes(html),
        category: toCategory(isObj<{ name?: string }>(cat) ? cat.name : undefined),
        tags: [],
        // `content` stays null so nothing tries to parse HTML as Markdown.
        content: null,
        contentHtml: html,
        featuredImage: isObj<{ url?: string; alt?: string }>(img) && img.url
          ? { url: img.url, alt: img.alt ?? null }
          : null,
        cmsAuthor: author,
      }
    })
}
