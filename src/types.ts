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
  documents?: Document[] | null;
  memberContent?: boolean;
}

export type PostShort = Pick<
  Post,
  "title" | "publishedAt" | "slug" | "mainImage" | "excerpt"
>;

export interface Document {
  title: string;
  draft: string;
  slug: Slug;
  body?: PortableTextBlock[];
  memberContent?: boolean;
  keywords?: string | null;
  description?: string | null;
  posts?: PostShort[] | null;
}

export interface Page {
  title: string;
  body?: PortableTextBlock[];
}
