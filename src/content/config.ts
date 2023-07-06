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
    keywords: z.array(z.string()).optional(),
    seed: z.record(z.any()).optional(),
    index: z
      .array(
        z.object({
          title: z.string(),
          questions: z.array(
            z.object({
              id: reference("questions"),
              title: z.string(),
              token: z.string().or(z.array(z.string())).optional(),
              template: reference("answers").optional(),
              type: z.enum(["date"]).optional(),
            })
          ),
        })
      )
      .optional(),
    encrypted: z.array(z.string()).optional(),
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
