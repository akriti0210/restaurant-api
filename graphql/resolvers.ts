import mongoose from "mongoose";
import Restaurant from "@/models/Restaurant";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

function formatRestaurant(r: any) {
  return {
    resId: r.resId,
    name: r.name,
    cloudinaryImageId: r.cloudinaryImageId,
    locality: r.locality,
    areaName: r.areaName,
    costForTwo: r.costForTwo,
    cuisines: r.cuisines || [],
    avgRating: r.avgRating,
    avgRatingString: r.avgRatingString,
    totalRatingsString: r.totalRatingsString,
    veg: r.veg,
    sla: r.sla,
    aggregatedDiscountInfoV3: r.aggregatedDiscountInfoV3,
    menu: r.menu || [],
  };
}

function formatRestaurants(restaurants: any[]) {
  return restaurants.map(formatRestaurant);
}

function applySort(restaurants: any[], sort?: string) {
  if (!sort) return restaurants;

  const s = sort.toUpperCase();
  const arr = [...restaurants];

  switch (s) {
    case "DELIVERY_TIME":
      return arr.sort((a, b) => (a.sla?.deliveryTime || 0) - (b.sla?.deliveryTime || 0));
    case "RATING":
      return arr.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    case "COST_ASC":
      return arr.sort((a, b) => {
        const ca = parseInt(a.costForTwo as any) || 0;
        const cb = parseInt(b.costForTwo as any) || 0;
        return ca - cb;
      });
    case "COST_DESC":
      return arr.sort((a, b) => {
        const ca = parseInt(a.costForTwo as any) || 0;
        const cb = parseInt(b.costForTwo as any) || 0;
        return cb - ca;
      });
    case "RELEVANCE":
    default:
      return arr;
  }
}

const resolvers = {
  Query: {
    restaurants: async () => {
      await connectDB();
      const restaurants = await Restaurant.find({});
      return formatRestaurants(restaurants);
    },

    searchRestaurants: async (_: any, { name, filter, sort }: any) => {
      await connectDB();
      const query: any = {
        name: { $regex: name, $options: "i" },
      };

      if (filter?.rating) query.avgRating = { $gte: filter.rating };
      if (filter?.cuisines && filter.cuisines.length > 0) query.cuisines = { $in: filter.cuisines };
      if (filter?.veg !== undefined) query.veg = filter.veg;

      const restaurants = await Restaurant.find(query);
      const formatted = formatRestaurants(restaurants);
      return applySort(formatted, sort);
    },

    getRestaurantById: async (_: any, { id }: any) => {
      await connectDB();
      const restaurant = await Restaurant.findOne({ resId: id });
      return restaurant ? formatRestaurant(restaurant) : null;
    },

    filterRestaurants: async (_: any, { rating, cuisines, veg, sort }: any) => {
      await connectDB();
      const query: any = {};
      if (rating) query.avgRating = { $gte: rating };
      if (cuisines && cuisines.length > 0) query.cuisines = { $in: cuisines };
      if (veg !== undefined) query.veg = veg;

      const restaurants = await Restaurant.find(query);
      const formatted = formatRestaurants(restaurants);
      return applySort(formatted, sort);
    },
  },
};

export default resolvers;
