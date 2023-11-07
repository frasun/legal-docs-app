import type { ImageAsset } from "@sanity/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { entityEnum } from "@utils/constants";
import type { MyDocument } from "@db/document";

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
  documents?: Pick<Template, "title" | "slug">[] | null;
  memberContent?: boolean;
}

export type PostShort = Pick<
  Post,
  "title" | "publishedAt" | "slug" | "mainImage" | "excerpt"
>;

export interface SanityDocument {
  title: string;
  draft: string;
  slug: string;
  body?: PortableTextBlock[];
  memberContent: boolean;
  keywords?: string | null;
  description?: string | null;
  posts: PostShort[] | null;
}

export interface Template extends SanityDocument {
  price: number | null;
  firstQuestionUrl: string;
}

export interface TemplateShort {
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

export interface UserDocument extends MyDocument {
  template: string;
}

export interface UserDocuments {
  documents: Record<string, UserDocument[]>;
  pages: number;
  currentPage: number;
}
