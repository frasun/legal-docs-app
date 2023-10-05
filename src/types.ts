import type { ImageAsset, Slug } from "@sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

export type Answers = Record<string, any>;

export interface PostShort {
  title: string;
  publishedAt: string;
  slug: Slug;
  mainImage?: ImageAsset;
  excerpt: string;
}

export interface Document {
  title: string;
  draft: string;
  body: PortableTextBlock[];
  memberContent: boolean;
  keywords?: string;
  description?: string;
  posts: PostShort[];
}
