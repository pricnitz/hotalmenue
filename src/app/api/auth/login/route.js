import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const lowerEmail = email.toLowerCase().trim();
    const pw = password.trim();

    const client = await clientPromise;
    const db = client.db("hotelmenu");

    // 1. Search in "users" collection (Master Admin, custom roles registered via API)
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: lowerEmail });

    if (user) {
      if (user.password === pw) {
        let redirectPath = "/dashboard/master";
        if (user.role === "owner") redirectPath = "/dashboard/restaurant";
        if (user.role === "waiter") redirectPath = "/dashboard/waiter";
        if (user.role === "kitchen") redirectPath = "/dashboard/kitchen";
        if (user.role === "billing") redirectPath = "/dashboard/waiter";
        if (user.role === "content") redirectPath = "/dashboard/content";

        return NextResponse.json(
          { role: user.role, redirect: redirectPath, userId: user._id, email: user.email, name: user.name || "", restaurantId: user.restaurantId || "" },
          { status: 200 }
        );
      }
    }

    // 2. Search in "restaurants" collection (Restaurant Owners/Admins)
    const restaurantsCollection = db.collection("restaurants");
    const restaurant = await restaurantsCollection.findOne({
      $or: [
        { email: lowerEmail },
        { userId: email.trim() }
      ]
    });

    if (restaurant) {
      const dbPassword = restaurant.password || "password";
      if (dbPassword === pw) {
        return NextResponse.json(
          { 
            role: "owner", 
            redirect: "/dashboard/restaurant", 
            restaurantId: restaurant._id,
            name: restaurant.name,
            ownerName: restaurant.ownerName
          },
          { status: 200 }
        );
      }
    }

    // 3. Fallback for Static Demo Accounts
    if ((lowerEmail === "master@tablemenu.in" || lowerEmail === "master@quickbite.com") && pw === "password") {
      return NextResponse.json({ role: "master", redirect: "/dashboard/master" }, { status: 200 });
    }
    if (lowerEmail === "content@tablemenu.in" && pw === "password") {
      return NextResponse.json({ role: "content", redirect: "/dashboard/content", email: "content@tablemenu.in" }, { status: 200 });
    }
    if (lowerEmail === "owner@cafe.com" && pw === "password") {
      return NextResponse.json({ role: "owner", redirect: "/dashboard/restaurant" }, { status: 200 });
    }
    if (lowerEmail === "waiter@cafe.com" && pw === "password") {
      return NextResponse.json({ role: "waiter", redirect: "/dashboard/waiter" }, { status: 200 });
    }
    if (lowerEmail === "kitchen@cafe.com" && pw === "password") {
      return NextResponse.json({ role: "kitchen", redirect: "/dashboard/kitchen" }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid credentials. Try using valid registration credentials." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Database Auth Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
