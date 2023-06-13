import { z, defineCollection, reference } from "astro:content";

const categories = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    index: z.boolean(),
  }),
});

const info = defineCollection({
  type: "content",
});

const documents = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    categories: z.array(reference("categories")),
    seed: z.record(z.any()),
    index: z.array(
      z.object({
        title: z.string(),
        questions: z.array(
          z.object({
            id: reference("questions"),
            title: z.string(),
            token: z.string().or(z.array(z.string())),
            template: z.string().optional(),
          })
        ),
      })
    ),
    encrypted: z.array(z.string()),
  }),
});

const questions = defineCollection({
  type: "content",
});

const answers = defineCollection({
  type: "content",
});

export const collections = {
  categories,
  info,
  documents,
  questions,
  answers,
};
