import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const mine = searchParams.get("mine");
  const session = await auth();

  const query: Record<string, unknown> = {};
  if (mine && session?.user) {
    query.author = (session.user as any).id;
  } else {
    query.status = "published";
  }
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  const posts = await Post.find(query)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "author")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, excerpt, coverImage, tags, status } = await req.json();
  if (!title || !content || !excerpt) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await Post.findOne({ slug })) slug = `${baseSlug}-${i++}`;

  const post = await Post.create({
    title, content, excerpt, coverImage, tags: tags ?? [],
    status: status ?? "draft",
    slug,
    author: (session.user as any).id,
  });
  return NextResponse.json(post, { status: 201 });
}
