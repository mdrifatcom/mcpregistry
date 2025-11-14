import { getAllPosts } from "@marketing/blog/utils/lib/posts";
import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";
import { getApprovedListings, getCategories, getTags } from "@repo/database";
import { allLegalPages } from "content-collections";
import type { MetadataRoute } from "next";
import { docsSource } from "./docs-source";

const baseUrl = getBaseUrl();
const locales = config.i18n.enabled
	? Object.keys(config.i18n.locales)
	: [config.i18n.defaultLocale];

const staticMarketingPages = ["", "/changelog", "/mcp"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	const [mcpListings, categories, tags] = await Promise.all([
		getApprovedListings({ limit: 1000 }),
		getCategories(),
		getTags(),
	]);

	return [
		...staticMarketingPages.flatMap((page) =>
			locales.map((locale) => ({
				url: new URL(`/${locale}${page}`, baseUrl).href,
				lastModified: new Date(),
				changeFrequency: 'daily' as const,
				priority: page === "" ? 1 : page === "/mcp" ? 0.9 : 0.8,
			})),
		),
		...posts.map((post) => ({
			url: new URL(`/${post.locale}/blog/${post.path}`, baseUrl).href,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		})),
		...allLegalPages.map((page) => ({
			url: new URL(`/${page.locale}/legal/${page.path}`, baseUrl).href,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		})),
		...docsSource.getLanguages().flatMap((locale) =>
			docsSource.getPages(locale.language).map((page) => ({
				url: new URL(
					`/${locale.language}/docs/${page.slugs.join("/")}`,
					baseUrl,
				).href,
				lastModified: new Date(),
				changeFrequency: 'weekly' as const,
				priority: 0.8,
			})),
		),
		...locales.flatMap((locale) =>
			mcpListings.map((listing) => ({
				url: new URL(`/${locale}/mcp/${listing.slug}`, baseUrl).href,
				lastModified: new Date(listing.updated_at),
				changeFrequency: 'weekly' as const,
				priority: listing.featured ? 0.9 : 0.8,
			}))
		),
		...locales.flatMap((locale) =>
			categories.map((category) => ({
				url: new URL(`/${locale}/mcp/categories/${category.slug}`, baseUrl).href,
				lastModified: new Date(category.updated_at),
				changeFrequency: 'daily' as const,
				priority: 0.7,
			}))
		),
		...locales.flatMap((locale) =>
			tags.map((tag) => ({
				url: new URL(`/${locale}/mcp/tags/${tag.slug}`, baseUrl).href,
				lastModified: new Date(tag.created_at),
				changeFrequency: 'daily' as const,
				priority: 0.6,
			}))
		),
	];
}
