export type CmsPostStatus = "draft" | "published";

export type CmsPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: CmsPostStatus;
  authorUserId: number | null;
  createdAt: string;
  updatedAt: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
};

export type CmsCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
};

export type CmsTag = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

export type CmsMedia = {
  id: number;
  title: string;
  url: string;
  altText: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

export type CmsUser = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  roles: string[];
};

export type CmsSetting = {
  id: number;
  keyName: string;
  value: string;
  groupName: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsStats = {
  posts: number;
  publishedPosts: number;
  categories: number;
  tags: number;
  media: number;
  users: number;
  settings: number;
};
