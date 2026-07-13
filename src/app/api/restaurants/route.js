import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    // Fetch restaurants list
    const restaurants = await collection.find({}).toArray();

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Database GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, ownerName, email, password, userId, phone, address, gstNumber, planType, expiryDate, status } = body;

    if (!name || !ownerName || !email) {
      return NextResponse.json({ error: "Name, Owner Name, and Email are required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    const newRestaurant = {
      name,
      ownerName,
      email,
      password: password || "password",
      userId: userId || `QB-OWNER-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: phone || "",
      address: address || "",
      gstNumber: gstNumber || "",
      planType: planType || "Growth",
      registrationDate: new Date().toISOString().split("T")[0],
      expiryDate: expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
      status: status || "Active",
      logoEmoji: "🍽️",
      themeColor: "orange",
    };

    const result = await collection.insertOne(newRestaurant);
    const savedRestaurant = { ...newRestaurant, _id: result.insertedId };

    return NextResponse.json(savedRestaurant, { status: 201 });
  } catch (error) {
    console.error("Database POST Error:", error);
    return NextResponse.json({ error: "Failed to register restaurant" }, { status: 500 });
  }
}
