import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("orders");

    // Fetch all active orders sorted by time
    const orders = await collection.find({}).sort({ timestamp: -1 }).toArray();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tableId, items, total } = body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Table ID and items list are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("orders");

    const newOrder = {
      tableId,
      items: items.map(item => ({
        name: item.name,
        qty: parseInt(item.qty) || 1,
        price: parseFloat(item.price) || 0,
        instructions: item.instructions || ""
      })),
      total: parseFloat(total) || 0,
      status: "Pending",
      customerNotes: "",
      timestamp: new Date().toISOString(),
    };

    const result = await collection.insertOne(newOrder);
    const saved = { ...newOrder, _id: result.insertedId };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Orders Error:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
