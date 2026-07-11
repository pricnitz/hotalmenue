import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const defaultCategories = [
  { name: "Appetizers" },
  { name: "Mains" },
  { name: "Drinks" },
  { name: "Desserts" }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    const categories = await collection.find({}).toArray();

    if (categories.length === 0) {
      await collection.insertMany(defaultCategories);
      const seeded = await collection.find({}).toArray();
      return NextResponse.json(seeded, { status: 200 });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("categories");

    // Check duplicate
    const existing = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const newCategory = { name };
    const result = await collection.insertOne(newCategory);
    const saved = { ...newCategory, _id: result.insertedId };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Categories Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
