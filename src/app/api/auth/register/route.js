import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required fields" },
        { status: 400 }
      );
    }

    const assignedRole = role || "master"; // Defaults to master if not provided

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("users");

    // Check if user already exists
    const existingUser = await collection.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const newUser = {
      email: email.toLowerCase().trim(),
      password: password.trim(),
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newUser);
    const savedUser = { ...newUser, _id: result.insertedId };
    delete savedUser.password; // Don't return password in response

    return NextResponse.json(
      { message: "User registered successfully", user: savedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Register Error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
