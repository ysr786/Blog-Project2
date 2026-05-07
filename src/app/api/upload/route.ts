import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "author")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { base64 } = await req.json();
  if (!base64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const url = await uploadImage(base64);
  return NextResponse.json({ url });
}
