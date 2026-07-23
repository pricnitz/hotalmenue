import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { slugify } from "../../../lib/slugify";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    
    // Ensure all returned blogs have a slug property for clean URLs
    const formattedBlogs = blogs.map(b => ({
      ...b,
      slug: b.slug || slugify(b.title)
    }));

    return NextResponse.json(formattedBlogs, { status: 200 });
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
      slug: slugify(title),
      summary: summary || "",
      content,
      category: category || "Growth & Guides",
      author: author || "TableMenu Team",
      readTime: readTime || "5 min read",
      coverImage: coverImage || "",
      createdAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    return NextResponse.json({ success: true, id: result.insertedId, slug: newBlog.slug }, { status: 201 });
  } catch (error) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
