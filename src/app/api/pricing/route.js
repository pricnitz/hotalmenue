import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const pricing = await db.collection("website_pricing").findOne({ key: "active_plans" });
    
    if (!pricing) {
      // Default fallback pricing tiers
      const defaultPricing = {
        key: "active_plans",
        plans: [
          {
            id: "starter",
            name: "Starter (1-10 QRs)",
            description: "Ideal for small cafes and eateries needing basic QR table ordering.",
            priceMonthly: 29,
            priceQuarterly: 26,
            priceHalfYearly: 23,
            priceAnnual: 21,
            qrRange: "1 - 10 Dining Tables (QR Range)",
            menuItems: "Up to 50 Menu Items",
            support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
            standee: "Digital Printable QR Cards",
          },
          {
            id: "growth",
            name: "Growth (11-30 QRs)",
            description: "Best for growing bistros and family restaurants looking to scale table orders.",
            priceMonthly: 79,
            priceQuarterly: 71,
            priceHalfYearly: 65,
            priceAnnual: 59,
            qrRange: "11 - 30 Dining Tables (QR Range)",
            menuItems: "Up to 200 Menu Items",
            support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
            standee: "Physical QR Standee / Tent Cards Included",
          },
          {
            id: "pro",
            name: "Pro Enterprise (31-50+ QRs)",
            description: "Perfect for high-volume dining, fine dining, and multi-outlet chains.",
            priceMonthly: 149,
            priceQuarterly: 134,
            priceHalfYearly: 120,
            priceAnnual: 111,
            qrRange: "31 - 50+ Dining Tables (QR Range)",
            menuItems: "Unlimited Menu Items",
            support: "1 Month Free Dedicated Support (Tech & Non-Tech)",
            standee: "Custom Acrylic QR Standees & Branding Kit",
          }
        ],
        updatedAt: new Date()
      };
      return NextResponse.json(defaultPricing.plans, { status: 200 });
    }

    return NextResponse.json(pricing.plans, { status: 200 });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const body = await req.json(); // Array of plan objects

    await db.collection("website_pricing").updateOne(
      { key: "active_plans" },
      { $set: { key: "active_plans", plans: body, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Pricing updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}
