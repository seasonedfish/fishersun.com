import { getCollection, type CollectionEntry } from "astro:content";
import { Temporal } from "temporal-polyfill";

export async function getPostsInReverseChronologicalOrder() {
    return (await getCollection("posts"))
        .toSorted((a, b) => a.data.pubDate.toISOString().localeCompare(b.data.pubDate.toISOString()))
        .toReversed();
}

/**
 * Returns an array of all tags used in the posts.
 */
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

/**
 * Returns an array of tuples of [tag, count] sorted by count in descending order.
 */
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
    return Array.from(counts.entries()).toSorted((a, b) => b[1] - a[1]);
}

/**
 * Returns posts that share tags with the given post, sorted by number of shared tags
 */
export async function getRelatedPosts(currentPost: CollectionEntry<"posts">, maxCount = 3) {
    const allPosts = await getPostsInReverseChronologicalOrder();

    // Get all posts except the current one
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

    // Calculate the number of shared tags for each post
    const relatedPosts = otherPosts.map(post => {
        const sharedTags = post.data.tags.filter(tag =>
            currentPost.data.tags.includes(tag)
        );
        return {
            post,
            sharedTagsCount: sharedTags.length
        };
    });

    // Filter posts that share at least one tag and sort by number of shared tags
    return relatedPosts
        .filter(item => item.sharedTagsCount > 0)
        .sort((a, b) => b.sharedTagsCount - a.sharedTagsCount)
        .slice(0, maxCount)
        .map(item => item.post);
}

export function zonedDateTimeFromDate(date: Date): Temporal.ZonedDateTime {
	return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO("America/New_York");
}
