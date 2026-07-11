import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// Initial mock data to seed if MongoDB collection is empty
const seedData = [
  {
    name: "Pizza Express (Downtown)",
    ownerName: "Marco Silva",
    phone: "+1 (555) 302-8491",
    email: "marco@pizzaexpress.com",
    address: "482 Pine St, San Francisco, CA",
    gstNumber: "GST29AAACP8493A1Z1",
    planType: "Growth",
    registrationDate: "2026-05-15",
    expiryDate: "2027-05-15",
    status: "Active",
    logoEmoji: "🍕",
    themeColor: "red",
  },
  {
    name: "Cafe Aroma (Bandra)",
    ownerName: "Aarav Sharma",
    phone: "+91 98200 12345",
    email: "aarav@cafearoma.in",
    address: "Plot 42, Bandra Reclamation, Bandra West, Mumbai, MH 400050",
    gstNumber: "GST27AAACP9934B1Z3",
    planType: "Starter",
    registrationDate: "2026-06-20",
    expiryDate: "2026-07-20",
    status: "Active",
    logoEmoji: "☕",
    themeColor: "orange",
  },
  {
    name: "The Steakhouse (Soho)",
    ownerName: "John Dupont",
    phone: "+44 20 7946 0958",
    email: "john@steakhouse.co.uk",
    address: "88 Wardour St, London, UK",
    gstNumber: "GST09AAACP4412C1Z5",
    planType: "Pro Enterprise",
    registrationDate: "2025-07-11",
    expiryDate: "2026-07-11",
    status: "Expired",
    logoEmoji: "🥩",
    themeColor: "charcoal",
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    // Fetch restaurants list
    const restaurants = await collection.find({}).toArray();

    // Auto-seed database if empty
    if (restaurants.length === 0) {
      await collection.insertMany(seedData);
      const seeded = await collection.find({}).toArray();
      return NextResponse.json(seeded, { status: 200 });
    }

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Database GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, ownerName, email, phone, address, gstNumber, planType, expiryDate, status } = body;

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
