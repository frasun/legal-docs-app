import type { ImageAsset, Slug } from "@sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

export type Answers = Record<string, any>;

export interface Post {
  title: string;
  publishedAt?: string | null;
  slug: Slug;
  mainImage?: ImageAsset | null;
  body?: PortableTextBlock[];
  excerpt?: string;
  keywords?: string | null;
  description?: string | null;
  documents?: Pick<Document, "title" | "slug">[] | null;
  memberContent?: boolean;
}

export type PostShort = Pick<
  Post,
  "title" | "publishedAt" | "slug" | "mainImage" | "excerpt"
>;

export interface SanityDocument {
  title: string;
  draft: string;
  slug: Slug;
  body?: PortableTextBlock[];
  memberContent: boolean;
  keywords?: string | null;
  description?: string | null;
  posts: PostShort[] | null;
}

export interface Document extends SanityDocument {
  price: number | null;
  firstQuestionUrl: string;
}

export interface DocumentShort {
  title: string;
  slug: string;
  price: number;
  categories: string[];
  draft: boolean;
}

export interface Page {
  title: string;
  body?: PortableTextBlock[];
}

export type Category = {
  id: string;
  data: { name: string };
};
