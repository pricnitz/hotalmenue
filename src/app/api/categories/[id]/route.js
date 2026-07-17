import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, name }, { status: 200 });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
