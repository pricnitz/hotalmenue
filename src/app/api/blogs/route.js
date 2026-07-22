import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, summary, content, category, author, readTime, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and Content are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    
    const newBlog = {
      title,
      summary: summary || "",
      content,
      category: category || "Growth & Guides",
      author: author || "TableMenu Team",
      readTime: readTime || "5 min read",
      coverImage: coverImage || "",
      createdAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
