import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const defaultMenu = [
  { name: "Truffle Cheeseburger", price: 12.99, category: "Mains", isVeg: false, isAvailable: true, prepTime: 12, description: "Prime beef patty, black truffle aioli, aged cheddar, brioche bun." },
  { name: "Spicy Crunch Chicken", price: 11.50, category: "Mains", isVeg: false, isAvailable: true, prepTime: 10, description: "Crispy chicken breast, spicy coleslaw, jalapeño slices, house sauce." },
  { name: "Margherita Classic", price: 14.00, category: "Mains", isVeg: true, isAvailable: true, prepTime: 15, description: "San Marzano tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil." },
  { name: "Spicy Pepperoni & Honey", price: 16.50, category: "Mains", isVeg: false, isAvailable: true, prepTime: 15, description: "Cured pepperoni, hot honey drizzle, fresh mozzarella, organic oregano." },
  { name: "Vanilla Cold Brew", price: 4.50, category: "Drinks", isVeg: true, isAvailable: true, prepTime: 3, description: "Slow-steeped cold brew infused with madagascar vanilla bean cream." },
  { name: "Fresh Mint Lemonade", price: 3.99, category: "Drinks", isVeg: true, isAvailable: true, prepTime: 4, description: "Hand-pressed lemons, fresh organic mint, sparkling soda." },
  { name: "Garlic Butter Knots", price: 5.99, category: "Appetizers", isVeg: true, isAvailable: true, prepTime: 8, description: "Freshly baked pizza dough knots tossed in garlic herb butter and parmesan." },
  { name: "Chocolate Lava Cake", price: 6.99, category: "Desserts", isVeg: true, isAvailable: true, prepTime: 7, description: "Warm chocolate cake with a molten fudge core, served with vanilla ice cream." }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const items = await collection.find({}).toArray();

    if (items.length === 0) {
      await collection.insertMany(defaultMenu);
      const seeded = await collection.find({}).toArray();
      return NextResponse.json(seeded, { status: 200 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET Menu Error:", error);
    return NextResponse.json({ error: "Failed to load menu items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, isVeg, isAvailable, prepTime, description } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: "Name, Price, and Category are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("menu_items");

    const newItem = {
      name,
      price: parseFloat(price),
      category,
      isVeg: isVeg === true,
      isAvailable: isAvailable !== false,
      prepTime: parseInt(prepTime) || 10,
      description: description || "",
    };

    const result = await collection.insertOne(newItem);
    const saved = { ...newItem, _id: result.insertedId };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST Menu Error:", error);
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
