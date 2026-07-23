import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { slugify } from "../../../../lib/slugify";

const fallbackPosts = [
  {
    _id: "1",
    slug: "how-qr-menus-increase-average-table-value-by-22",
    title: "How QR Menus Increase Average Table Value by 22%",
    summary: "A comprehensive data study of digital ordering habits. Learn how dynamic pairings and high-res photography trigger upselling without waiter intervention.",
    content: `Digital menus have revolutionized how diners browse food. By presenting high-resolution imagery and automatic pairing suggestions (like suggesting fries with a burger), restaurants experience a proven 22% increase in average ticket size.

Key Takeaways:
1. High-res imagery increases dessert orders by 35%.
2. Real-time out-of-stock toggles prevent customer disappointment.
3. Multi-language translation captures international tourists effortlessly.`,
    category: "Operations",
    readTime: "5 min read",
    date: "Jul 8, 2026",
    author: "Payal Pandit",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  },
  {
    _id: "2",
    slug: "dedicated-technical-support-standee-branding-for-modern-restaurants",
    title: "Dedicated Technical Support & Standee Branding for Modern Restaurants",
    summary: "Why having 1-on-1 technical and non-technical support transforms digital menu adoption for your restaurant staff and patrons.",
    content: `Onboarding a new restaurant technology shouldn't feel overwhelming. With TableMenu.in, every outlet receives 1 Month of Free Dedicated Support covering setup, staff training, and physical QR standee design.

Benefits of Dedicated Support:
- Zero technical friction for kitchen staff.
- Custom acrylic table tent cards delivered ready to print.
- 24/7 hotline for emergency menu updates.`,
    category: "Guides",
    readTime: "4 min read",
    date: "Jul 15, 2026",
    author: "Durgawati Pandit",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
  },
  {
    _id: "3",
    slug: "how-to-set-up-kitchen-display-system-kds-terminal",
    title: "How to Set Up a Kitchen Display System (KDS) Terminal",
    summary: "Why thermal paper receipt printing is costing you money. Learn how color-coded timers on mounted tablets optimize prep workflows.",
    content: `Paper receipt printing in hot kitchens creates clutter, lost tickets, and slow prep times. Replacing thermal printers with web-based tablets connected directly to customer QR carts guarantees instant order arrival.

KDS Advantages:
1. Color-coded prep timers (Green -> Amber -> Red urgency).
2. One-tap "Order Ready" chime to alert waiters.
3. Zero paper costs and zero missed orders.`,
    category: "Hardware",
    readTime: "4 min read",
    date: "Jun 11, 2026",
    author: "Nitesh Ahirwar",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");

    let blog = null;
    const cleanParam = decodeURIComponent(id).trim();

    // 1. Try finding in MongoDB by slug
    blog = await db.collection("blogs").findOne({ slug: cleanParam });

    // 2. Try finding in MongoDB by _id if valid ObjectId
    if (!blog && ObjectId.isValid(cleanParam)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(cleanParam) });
    }

    // 3. Try finding in MongoDB by slugified title
    if (!blog) {
      const allBlogs = await db.collection("blogs").find({}).toArray();
      blog = allBlogs.find(b => slugify(b.title) === cleanParam || b._id.toString() === cleanParam);
    }

    // 4. Fallback search in static demo posts
    if (!blog) {
      blog = fallbackPosts.find(p => p.slug === cleanParam || p._id === cleanParam || slugify(p.title) === cleanParam);
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Attach computed slug if missing
    if (!blog.slug) {
      blog.slug = slugify(blog.title);
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("GET Blog ID Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, summary, content, category, author, readTime, coverImage } = body;

    const client = await clientPromise;
    const db = client.db("hotelmenu");

    const updateDoc = {
      $set: {
        title,
        slug: slugify(title),
        summary: summary || "",
        content,
        category: category || "Growth & Guides",
        author: author || "TableMenu Team",
        readTime: readTime || "5 min read",
        coverImage: coverImage || "",
        updatedAt: new Date(),
      }
    };

    let result = null;
    if (ObjectId.isValid(id)) {
      result = await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, updateDoc);
    } else {
      result = await db.collection("blogs").updateOne({ slug: id }, updateDoc);
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("hotelmenu");

    let result = null;
    if (ObjectId.isValid(id)) {
      result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await db.collection("blogs").deleteOne({ slug: id });
    }

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
