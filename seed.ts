import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant";
import data from "./data/restaurants.json";

dotenv.config();

async function seed() {

  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  
  await mongoose.connect(process.env.MONGODB_URI!);

  await Restaurant.deleteMany();

  const formatted = data.map((item: any) => item.info);

  await Restaurant.insertMany(formatted);

  console.log("Data seeded successfully");
  process.exit();
}

seed();
