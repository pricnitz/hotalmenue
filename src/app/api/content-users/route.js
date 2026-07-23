import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { validatePassword } from "../../../lib/passwordValidation";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const users = await db
      .collection("users")
      .find({ role: "content" })
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching content users:", error);
    return NextResponse.json({ error: "Failed to fetch content users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json();

    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const passVal = validatePassword(password);
    if (!passVal.isValid) {
      return NextResponse.json({ error: passVal.error }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db.collection("users").findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const newContentUser = {
      name: name?.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      password: password.trim(),
      role: "content",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(newContentUser);

    const createdUser = {
      _id: result.insertedId,
      name: newContentUser.name,
      email: newContentUser.email,
      role: newContentUser.role,
      createdAt: newContentUser.createdAt,
    };

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Error creating content user:", error);
    return NextResponse.json({ error: "Failed to create content user" }, { status: 500 });
  }
}
