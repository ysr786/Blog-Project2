import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug }).populate("author", "name avatar bio").lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.author.toString() !== (session.user as any).id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  Object.assign(post, body);
  await post.save();
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.author.toString() !== (session.user as any).id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await post.deleteOne();
  return NextResponse.json({ success: true });
}
