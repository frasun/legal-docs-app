import { z, defineCollection, reference } from "astro:content";

const questionsIndex = z.array(
  z.object({
    id: reference("questions"),
    title: z.string(),
    token: z.string().or(z.array(z.string())).optional(),
    answer: reference("answers").optional(),
    type: z.enum(["date"]).optional(),
  })
);

export type QuestionIndex = z.infer<typeof questionsIndex>;

const documents = defineCollection({
  type: "content",
  schema: z.object({
    index: questionsIndex.optional(),
    dates: z.array(z.string()).optional(),
    encryptedFields: z.array(z.string()).optional(),
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
  documents,
  questions,
  answers,
};
