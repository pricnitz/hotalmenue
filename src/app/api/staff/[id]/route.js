import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, password, role, phone } = body;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("users");

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (password && password.trim() !== "") updateData.password = password.trim();

    // Check duplicate email if email is being updated
    if (email) {
      const existingUser = await collection.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: new ObjectId(id) }
      });
      if (existingUser) {
        return NextResponse.json({ error: "Another user already exists with this email address" }, { status: 400 });
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT Staff ID Error:", error);
    return NextResponse.json({ error: "Failed to update staff profile" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("users");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff member deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Staff ID Error:", error);
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}
