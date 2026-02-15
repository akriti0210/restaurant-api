import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Restaurant from "@/models/Restaurant";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET() {
  try {
    await connectDB();

    const restaurants = await Restaurant.find({});

    const formatted = restaurants.map((r) => ({
      info: {
        resId: r.resId,
        name: r.name,
        cloudinaryImageId: r.cloudinaryImageId,
        locality: r.locality,
        areaName: r.areaName,
        costForTwo: r.costForTwo,
        cuisines: r.cuisines,
        avgRating: r.avgRating,
        avgRatingString: r.avgRatingString,
        totalRatingsString: r.totalRatingsString,
        veg: r.veg,
        sla: r.sla,
        aggregatedDiscountInfoV3: r.aggregatedDiscountInfoV3,
      },
    }));

    return NextResponse.json({
      status: true,
      message: "Restaurant List fetched successfully",
      data: {
        data: {
          cards: [
            {},
            {
              card: {
                card: {
                  gridElements: {
                    infoWithStyle: {
                      restaurants: formatted,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: false,
      message: "Failed to fetch restaurants",
    });
  }
}
