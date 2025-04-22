import { getCollection } from "astro:content";

export async function getPostsInReverseChronologicalOrder() {
    return (await getCollection("posts"))
        .toSorted((a, b) => a.data.pubDate.toISOString().localeCompare(b.data.pubDate.toISOString()))
        .toReversed();
}

export async function getTags() {
    const posts = await getCollection("posts");
    const tags = new Set<string>();
    for (const post of posts) {
        for (const tag of post.data.tags) {
            tags.add(tag);
        }
    }
    return Array.from(tags);
}

export async function getTagCounts() {
    const posts = await getCollection("posts");
    const counts = new Map<string, number>();
    for (const post of posts) {
        for (const tag of post.data.tags) {
            if (counts.has(tag)) {
                counts.set(tag, counts.get(tag)! + 1);
            } else {
                counts.set(tag, 1);
            }
        }
    }
    return counts;
}