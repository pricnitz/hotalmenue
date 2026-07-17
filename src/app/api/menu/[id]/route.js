import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, isVeg, isAvailable, prepTime, description, image } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: "Name, Price, and Category are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const updateDoc = {
      $set: {
        name,
        price: parseFloat(price),
        category,
        isVeg: isVeg === true,
        isAvailable: isAvailable !== false,
        prepTime: parseInt(prepTime) || 10,
        description: description || "",
        image: image || ""
      }
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("PUT Menu Item Error:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE Menu Item Error:", error);
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
