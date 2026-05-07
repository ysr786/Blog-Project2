import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const liked = post.likes.map(String).includes(userId);
  if (liked) post.likes = post.likes.filter((id: unknown) => (id as { toString(): string }).toString() !== userId);
  else post.likes.push(userId);
  await post.save();
  return NextResponse.json({ likes: post.likes.length, liked: !liked });
}
