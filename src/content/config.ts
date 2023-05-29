import { z, defineCollection } from "astro:content";

const categories = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    index: z.boolean(),
  }),
});

export const collections = {
  categories: categories,
};
