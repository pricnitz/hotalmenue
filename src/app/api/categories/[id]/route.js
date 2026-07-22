import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, svg } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");
    const menuCollection = db.collection("menu_items");

    // Fetch existing category to check for name change
    const oldCat = await collection.findOne({ _id: new ObjectId(id) });
    if (!oldCat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const updateDoc = { name };
    if (svg !== undefined) {
      updateDoc.svg = svg;
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    // If category name changed, sync menu items with old category name
    if (oldCat.name !== name) {
      await menuCollection.updateMany(
        { restaurantId: oldCat.restaurantId, category: oldCat.name },
        { $set: { category: name } }
      );
    }

    return NextResponse.json({ success: true, name, svg }, { status: 200 });
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
