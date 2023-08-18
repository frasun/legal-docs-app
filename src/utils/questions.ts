import { getEntry } from "astro:content";
import type { DocumentIndex, QuestionIndex } from "@content/config";

export default async function (index: DocumentIndex) {
  const questionIndex: QuestionIndex = [];
  for (let item of index) {
    questionIndex.push(...item.questions);
  }

  const questionEntries = [];
  for (let {
    id: { slug },
  } of questionIndex) {
    const question = await getEntry("questions", slug);
    questionEntries.push(question);
  }

  return { questionIndex, questionEntries };
}
