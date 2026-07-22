import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    
    const updateData = {};
    const fields = ["status", "items", "total", "customerNotes"];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (body.status === "Ready") {
      updateData.readyTimestamp = new Date().toISOString();
    }
    if (body.status === "Served" || body.status === "Completed") {
      updateData.completedTimestamp = new Date().toISOString();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("orders");

    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const existingOrder = await collection.findOne(query);
    const result = await collection.updateOne(query, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Emit Socket.IO realtime order status update event
    try {
      if (global.io) {
        const restId = (existingOrder && existingOrder.restaurantId) || body.restaurantId || "";
        if (restId) {
          global.io.to(`restaurant_${restId}`).emit("order-changed", { type: "UPDATE", id, updateData, restaurantId: restId });
        }
        global.io.emit("order-changed", { type: "UPDATE", id, updateData, restaurantId: restId });
      }
    } catch (e) {
      console.error("Socket.IO emit error on PUT /api/orders/[id]:", e);
    }

    return NextResponse.json({ success: true, status: body.status }, { status: 200 });
  } catch (error) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const client = await clientPromise;
    const db = client.db("hotelmenu");
    const collection = db.collection("orders");

    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      query = { _id: id };
    }

    const existingOrder = await collection.findOne(query);
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Emit Socket.IO realtime order deletion event
    try {
      if (global.io) {
        const restId = (existingOrder && existingOrder.restaurantId) || "";
        if (restId) {
          global.io.to(`restaurant_${restId}`).emit("order-changed", { type: "DELETE", id, restaurantId: restId });
        }
        global.io.emit("order-changed", { type: "DELETE", id, restaurantId: restId });
      }
    } catch (e) {
      console.error("Socket.IO emit error on DELETE /api/orders/[id]:", e);
    }

    return NextResponse.json({ success: true, message: "Order cleared" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Order Error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
