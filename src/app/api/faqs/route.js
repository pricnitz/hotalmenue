import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const faqs = await db.collection("faqs").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    const newFaq = {
      category: body.category || "general",
      question: body.question,
      answer: body.answer,
      createdAt: new Date(),
    };

    const result = await db.collection("faqs").insertOne(newFaq);
    return NextResponse.json({ _id: result.insertedId, ...newFaq }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
