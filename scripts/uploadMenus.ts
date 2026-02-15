import fs from "fs";
import path from "path";
import mongoose, { Schema, Document, Model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

/* =========================
   Types
========================= */

interface IRestaurantMenu extends Document {
  restaurantId: string;
  menu: Record<string, any>;
}

/* =========================
   Schema & Model
========================= */

const RestaurantMenuSchema = new Schema<IRestaurantMenu>({
  restaurantId: { type: String, required: true, unique: true },
  menu: { type: Schema.Types.Mixed, required: true },
});

const RestaurantMenu: Model<IRestaurantMenu> =
  mongoose.models.RestaurantMenu ||
  mongoose.model<IRestaurantMenu>(
    "RestaurantMenu",
    RestaurantMenuSchema
  );

/* =========================
   Upload Function
========================= */

async function uploadMenus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const dataFolder = path.join(process.cwd(), "data");
    const files = fs.readdirSync(dataFolder);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const restaurantId = file.replace(".json", "");
      const filePath = path.join(dataFolder, file);

      const jsonData = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      );

      await RestaurantMenu.findOneAndUpdate(
        { restaurantId },
        { restaurantId, menu: jsonData },
        { upsert: true }
      );

      console.log(`Uploaded menu for restaurant ${restaurantId}`);
    }

    console.log("All menus uploaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Upload failed:", error);
    process.exit(1);
  }
}

/* =========================
   Run Script
========================= */

uploadMenus();