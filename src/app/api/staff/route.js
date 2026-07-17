import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("users");

    // Fetch staff members (waiter/kitchen/billing) belonging to the restaurant
    const staff = await collection
      .find({
        restaurantId: restaurantId,
        role: { $in: ["waiter", "kitchen", "billing"] }
      })
      .project({ password: 0 }) // Exclude passwords from response
      .toArray();

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error("GET Staff Error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, restaurantId } = body;

    if (!email || !password || !role || !restaurantId) {
      return NextResponse.json(
        { error: "Email, Password, Role, and Restaurant ID are required fields" },
        { status: 400 }
      );
    }

    if (!["waiter", "kitchen", "billing"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be 'waiter', 'kitchen', or 'billing'" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("users");

    // Check duplicate email
    const existingUser = await collection.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "A user already exists with this email address" }, { status: 400 });
    }

    const newStaff = {
      name: name || "",
      email: email.toLowerCase().trim(),
      password: password.trim(),
      role: role,
      phone: phone || "",
      restaurantId: restaurantId,
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newStaff);
    const saved = { ...newStaff, _id: result.insertedId };
    delete saved.password;

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Staff Error:", error);
    return NextResponse.json({ error: "Failed to add staff member" }, { status: 500 });
  }
}
