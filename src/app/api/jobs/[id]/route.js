import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    let query = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }

    const updateDoc = {
      $set: {
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        experience: body.experience,
        description: body.description,
        requirements: body.requirements,
        applyEmail: body.applyEmail,
        status: body.status,
        updatedAt: new Date(),
      }
    };

    const result = await db.collection("jobs").updateOne(query, updateDoc);
    return NextResponse.json({ message: "Job posting updated successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating job posting:", error);
    return NextResponse.json({ error: "Failed to update job posting" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");

    let query = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }

    await db.collection("jobs").deleteOne(query);
    return NextResponse.json({ message: "Job posting deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return NextResponse.json({ error: "Failed to delete job posting" }, { status: 500 });
  }
}
