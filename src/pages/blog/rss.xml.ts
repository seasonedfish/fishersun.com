import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
    const posts = await getCollection("posts");
    return rss({
        title: "Fisher's Blog",
        description: "Fisher's blog posts on programming",
        site: `${context.site!.href}/blog`,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.slug}`
        })),
        customData: `<language>en-us</language>`,
    })
}