import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");

    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Content user deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting content user:", error);
    return NextResponse.json({ error: "Failed to delete content user" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    const updateFields = {};
    if (body.name) updateFields.name = body.name.trim();
    if (body.password) updateFields.password = body.password.trim();

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ message: "Content user updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating content user:", error);
    return NextResponse.json({ error: "Failed to update content user" }, { status: 500 });
  }
}
