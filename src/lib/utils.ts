import { getCollection } from "astro:content";

export async function getPostsInReverseChronologicalOrder() {
    return (await getCollection("posts"))
        .toSorted((a, b) => a.data.pubDate.toISOString().localeCompare(b.data.pubDate.toISOString()))
        .toReversed();
}
