import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const RestaurantMenuSchema = new mongoose.Schema({
  restaurantId: String,
  menu: Object,
});

const RestaurantMenu =
  mongoose.models.RestaurantMenu ||
  mongoose.model("RestaurantMenu", RestaurantMenuSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();

  const menu = await RestaurantMenu.findOne({
    restaurantId: id,
  });

  if (!menu) {
    return NextResponse.json({
      status: false,
      message: "Restaurant menu not found",
    });
  }

  return NextResponse.json(menu.menu);
}
