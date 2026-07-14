import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    const query = restaurantId ? { restaurantId } : {};
    const categories = await collection.find(query).toArray();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, restaurantId } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    // Check duplicate *only within the same restaurant*
    const existing = await collection.findOne({
      restaurantId: restaurantId || "",
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const newCategory = { name, restaurantId: restaurantId || "" };
    const result = await collection.insertOne(newCategory);
    const saved = { ...newCategory, _id: result.insertedId };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Categories Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
