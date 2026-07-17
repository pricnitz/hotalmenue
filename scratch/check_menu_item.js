process.env.MONGODB_URI = "mongodb+srv://hotelmenu:pricnitz@cluster0.52chms3.mongodb.net/?appName=Cluster0";
const clientPromise = require('../src/lib/mongodb').default;

async function test() {
  try {
    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const item = await db.collection("menu_items").findOne({ name: /Butter/i });
    console.log("DB ITEM:", item ? { name: item.name, hasImage: !!item.image, imageLength: item.image ? item.image.length : 0 } : "Not found");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();
