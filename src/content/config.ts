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

const questionsIndex = z.array(
  z.object({
    id: reference("questions"),
    title: z.string(),
    token: z.string().or(z.array(z.string())).optional(),
    answer: reference("answers").optional(),
    type: z.enum(["date"]).optional(),
  })
);

const documentIndex = z.array(
  z.object({
    title: z.string(),
    questions: questionsIndex,
  })
);

export type QuestionIndex = z.infer<typeof questionsIndex>;
export type DocumentIndex = z.infer<typeof documentIndex>;

const documents = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    categories: z.array(reference("categories")),
    keywords: z.array(z.string()).optional(),
    priceId: z.string(),
    index: documentIndex.optional(),
    dates: z.array(z.string()).optional(),
    dataFields: z.array(z.string()).optional(),
    encryptedFields: z.array(z.string()).optional(),
    draft: z.boolean(),
    memberContent: z.boolean().optional(),
  }),
});

const questions = defineCollection({
  type: "content",
  schema: z
    .object({
      question: z.string(),
      info: z.string().optional(),
    })
    .passthrough(),
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
