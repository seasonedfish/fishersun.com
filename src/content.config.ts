import type { ImageMetadata } from "astro"
import { z, defineCollection } from "astro:content"
import { glob } from "astro/loaders"

const postsCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        tags: z.array(z.string())
    })
})

const projectsCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects" }),
    schema: z.object({
        name: z.string(),
        repo: z.optional(z.string().url()),
        website: z.optional(z.string().url()),
        image: z.optional(z.custom<ImageMetadata>())
    })
})

export const collections = {
    posts: postsCollection,
    projects: projectsCollection
}