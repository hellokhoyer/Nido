import { listings } from "./listings";
import { locations } from "./locations";
import { reviews } from "./reviews";
import { users } from "./users";

// Database key for localStorage simulation
const DB_KEY = process.env.DB_KEY || "listings_app_db";

// Simple localStorage simulation for Node.js environment
const storage = new Map();

const getItem = (key) => {
  return storage.get(key);
};

const setItem = (key, value) => {
  storage.set(key, value);
};

// Add all data to simulated database
export const seedLocalDatabase = () => {
  const database = getItem(DB_KEY);

  // If a database already exists, do nothing
  if (database) {
    return;
  }

  // Creates the initial database with all data
  const initialDatabase = {
    listings,
    locations,
    users,
    reviews,
  };

  setItem(DB_KEY, initialDatabase);
};

// Export storage access functions for API use
export const getDatabase = () => getItem(DB_KEY);
export const updateDatabase = (data) => setItem(DB_KEY, data);
