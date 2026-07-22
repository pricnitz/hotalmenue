import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const restaurant = await collection.findOne(query);

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Exclude password from the returned profile for security
    const { password, ...safeProfile } = restaurant;

    return NextResponse.json(safeProfile, { status: 200 });
  } catch (error) {
    console.error("Database GET Single Error:", error);
    return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    
    // Extract updateable fields
    const updateData = {};
    const fields = [
      "name", "ownerName", "phone", "email", "address", 
      "gstNumber", "planType", "expiryDate", "status", 
      "logoEmoji", "themeColor", "password", "userId", "logo", "currency", "isLocked"
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    // Establish query selector, supporting both BSON ObjectId and fallback String matching
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const result = await collection.updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedFields: updateData }, { status: 200 });
  } catch (error) {
    console.error("Database PUT Error:", error);
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("restaurants");

    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Restaurant deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Database DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 });
  }
}
