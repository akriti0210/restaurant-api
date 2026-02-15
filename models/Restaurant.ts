import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  resId: String,
  name: String,
  cloudinaryImageId: String,
  locality: String,
  areaName: String,
  costForTwo: String,
  cuisines: [String],
  avgRating: Number,
  avgRatingString: String,
  totalRatingsString: String,
  veg: Boolean,
  sla: {
    deliveryTime: Number,
    lastMileTravel: Number,
    slaString: String,
  },
  aggregatedDiscountInfoV3: {
    header: String,
    subHeader: String,
  },

  // NEW MENU FIELD
  menu: {
    type: Array,
    default: [],
  },
});

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", RestaurantSchema);
