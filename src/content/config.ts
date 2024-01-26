import type { ImageMetadata } from "astro"
import { z, defineCollection } from "astro:content"

const postsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        tags: z.array(z.string())
    })
})

const projectsCollection = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        technologies: z.array(z.string()),
        image: z.optional(z.custom<ImageMetadata>())
    })
})

export const collections = {
    posts: postsCollection,
    projects: projectsCollection
}