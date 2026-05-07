export type Role = "author" | "reader";
export type PostStatus = "draft" | "published";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: { _id: string; name: string; avatar?: string };
  status: PostStatus;
  likes: string[];
  tags: string[];
  createdAt: string;
}

export interface PostFull extends PostCard {
  content: string;
}

export interface CommentWithAuthor {
  _id: string;
  content: string;
  author: { _id: string; name: string; avatar?: string };
  post: string;
  createdAt: string;
}
