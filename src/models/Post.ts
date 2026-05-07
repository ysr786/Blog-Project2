import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: Types.ObjectId;
  status: "draft" | "published";
  likes: Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
