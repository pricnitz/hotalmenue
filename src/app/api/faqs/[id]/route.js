import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    const updateFields = {};
    if (body.category !== undefined) updateFields.category = body.category;
    if (body.question !== undefined) updateFields.question = body.question;
    if (body.answer !== undefined) updateFields.answer = body.answer;

    await db.collection("faqs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ message: "FAQ updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");

    await db.collection("faqs").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "FAQ deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
