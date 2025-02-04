import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPostsInReverseChronologicalOrder } from "../../lib/utils";

export async function GET(context: APIContext) {
    const posts = await getPostsInReverseChronologicalOrder();
    
    return rss({
        title: "Fisher's Blog",
        description: "Fisher's blog posts on programming",
        site: `${context.site!.href}/blog`,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.id}`
        })),
        customData: `<language>en-us</language>`,
    })
}