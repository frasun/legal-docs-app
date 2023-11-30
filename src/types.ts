import type { ImageAsset } from "@sanity/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { entityEnum } from "@utils/constants";
import type { MyDocument } from "@db/document";
import { User } from "@db/user";

export type Answers = Record<string, any>;

export interface Post {
  title: string;
  publishedAt?: string | null;
  slug: string;
  mainImage?: ImageAsset | null;
  body?: PortableTextBlock[];
  excerpt?: string;
  keywords?: string | null;
  description?: string | null;
  documents?: Pick<TemplateInfo, "title" | "slug">[] | null;
  memberContent?: boolean;
}

export type PostShort = Pick<
  Post,
  "title" | "publishedAt" | "slug" | "mainImage" | "excerpt"
>;

export interface DocumentInfo {
  title: string;
  draft: boolean;
  slug: string;
  body?: PortableTextBlock[];
  memberContent: boolean;
  keywords?: string | null;
  description?: string | null;
  posts: PostShort[] | null;
}

export interface TemplateInfo extends DocumentInfo {
  price: number | null;
  firstQuestionUrl: string;
}

export interface TemplateShort {
  title: DocumentInfo["title"];
  slug: DocumentInfo["slug"];
  price: number;
  categories: string[];
  draft: DocumentInfo["draft"];
}

export interface Template {
  title: DocumentInfo["title"];
  index: {
    title: string;
    questions: {
      title: string;
      slug: string;
      token?: string;
      answer?: string;
      type?: string;
    }[];
  }[];
  encryptedFields?: string[];
  dateFields?: string[];
  dataFields?: string[];
}

export interface TemplateSummary {
  title: Template["title"];
  index: Template["index"];
  answers: Answers;
  canGenerate: boolean;
}

export interface Page {
  title: string;
  body?: PortableTextBlock[];
}

export type Category = {
  id: string;
  data: { name: string };
};

export interface BlogPosts {
  posts: Pick<
    Post,
    "title" | "publishedAt" | "mainImage" | "excerpt" | "slug"
  >[];
  pages: number;
}

export interface Identity {
  type: (typeof entityEnum)[number];
  name: string;
  pin: string;
  street: string;
  apt?: string;
  postalCode: string;
  city: string;
}

export interface UserIdentity extends Identity {
  _id: string;
}

export interface UserIdentities {
  identities: UserIdentity[];
  count: number;
}

export interface UserDocument extends MyDocument {
  template: string;
}

export interface UserDocuments {
  documents: Record<string, UserDocument[]>;
  pages: number;
  currentPage: number;
}

export interface Question {
  question: string;
  questionShort?: string;
  info?: string;
  answers: Answers;
  nextId: string;
  prevId: string | null;
  currentQuestionIndex: number;
  documentTitle: Template["title"];
  templateId: string;
  draft: boolean;
  index: Template["index"];
  questionIndex: number;
}

export interface UserSession {
  documentId: string;
  ssid: string;
  stripeId?: string;
}

export interface UserProfile {
  email: User["email"];
  created: User["created"];
  documents: number;
  drafts: number;
  identities: number;
}
