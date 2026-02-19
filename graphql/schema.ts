import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Restaurant {
    resId: String!
    name: String!
    cloudinaryImageId: String
    locality: String
    areaName: String
    costForTwo: String
    cuisines: [String!]!
    avgRating: Float
    avgRatingString: String
    totalRatingsString: String
    veg: Boolean
    sla: SLA
    aggregatedDiscountInfoV3: Discount
    menu: [MenuItem!]!
  }

  type RestaurantCard {
    info: Restaurant!
}

  type SLA {
    deliveryTime: Int
    lastMileTravel: Int
    slaString: String
  }

  type Discount {
    header: String
    subHeader: String
  }

  type MenuItem {
    id: String
    name: String
    price: Int
    description: String
  }

  input RestaurantFilter {
    rating: Float
    cuisines: [String!]
    veg: Boolean
  }

  type Query {
    restaurants: [RestaurantCard!]!
    searchRestaurants(name: String!, filter: RestaurantFilter, sort: String): [RestaurantCard!]!
    getRestaurantById(id: String!): RestaurantCard
    filterRestaurants(rating: Float, cuisines: [String!], veg: Boolean, sort: String): [RestaurantCard!]!
  }
`;
