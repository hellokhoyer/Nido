import { listings } from "./data/listings.js";
import { locations } from "./data/locations.js";
import { reviews } from "./data/reviews.js";
import { users } from "./data/users.js";
import { getDatabaseTable, setDatabaseTable } from "./helpers.js";

export const initializeDatabase = () => {
  if (getDatabaseTable("users")) {
    console.log("Database already initialized");
    return;
  }

  console.log("Initializing database with seed data...");

  setDatabaseTable("users", users);
  setDatabaseTable("listings", listings);
  setDatabaseTable("locations", locations);
  setDatabaseTable("reviews", reviews);

  console.log("Database initialized successfully");
};
