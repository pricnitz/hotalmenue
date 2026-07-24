import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const jobs = await db.collection("jobs").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    const newJob = {
      title: body.title,
      department: body.department || "Engineering",
      location: body.location || "Bhopal, MP / Remote",
      type: body.type || "Full-time",
      experience: body.experience || "1-3 Years",
      description: body.description,
      requirements: body.requirements || [],
      applyEmail: body.applyEmail || "careers@hotelmenu.in",
      status: body.status || "Active",
      createdAt: new Date(),
    };

    const result = await db.collection("jobs").insertOne(newJob);
    return NextResponse.json({ _id: result.insertedId, ...newJob }, { status: 201 });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 });
  }
}
