import type { Metadata } from "next";

const BASE_URL = "https://qpu.co";
const SITE_NAME = "QPU.co";

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "",
  keywords = [],
  type = "website",
  publishedAt,
  updatedAt,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: [
      "quantum computing",
      "QPU",
      "quantum processor",
      "quantum hardware",
      ...keywords,
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: "en_US",
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function buildQPUSchema(qpu: {
  name: string;
  description?: string;
  provider: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: qpu.name,
    description: qpu.description,
    brand: { "@type": "Organization", name: qpu.provider },
    url: `${BASE_URL}/qpus/${qpu.slug}`,
  };
}

export function buildArticleSchema(article: {
  title: string;
  dek?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    author: { "@type": "Person", name: article.author },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    url: `${BASE_URL}/intelligence/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ label: string; href?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${BASE_URL}${item.href}` }),
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    description:
      "Independent quantum-computing hardware intelligence and discovery platform.",
    sameAs: [],
  };
}
