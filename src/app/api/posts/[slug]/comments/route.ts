import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { auth } from "@/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug }).select("_id");
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const comments = await Comment.find({ post: post._id })
    .populate("author", "name avatar")
    .sort({ createdAt: 1 })
    .lean();
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  await connectDB();
  const post = await Post.findOne({ slug }).select("_id");
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comment = await Comment.create({ content, author: (session.user as any).id, post: post._id });
  await comment.populate("author", "name avatar");
  return NextResponse.json(comment, { status: 201 });
}
