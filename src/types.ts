import type { ImageAsset, Slug } from "@sanity/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { entityEnum } from "@utils/constants";
import type { UUID } from "mongodb";

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

interface UserIdentity extends Identity {
  _id: string;
}

export interface UserIdentities {
  identities: UserIdentity[];
  count: number;
}
