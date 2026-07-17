import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const query = restaurantId ? { restaurantId } : {};
    const items = await collection.find(query).toArray();

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET Menu Error:", error);
    return NextResponse.json({ error: "Failed to load menu items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, isVeg, isAvailable, prepTime, description, restaurantId, image } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: "Name, Price, and Category are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const newItem = {
      name,
      price: parseFloat(price),
      category,
      isVeg: isVeg === true,
      isAvailable: isAvailable !== false,
      prepTime: parseInt(prepTime) || 10,
      description: description || "",
      restaurantId: restaurantId || "",
      image: image || "",
    };

    const result = await collection.insertOne(newItem);
    const saved = { ...newItem, _id: result.insertedId };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Menu Error:", error);
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
