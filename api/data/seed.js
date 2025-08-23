import { listings } from "./listings";
import { locations } from "./locations";
import { reviews } from "./reviews";
import { users } from "./users";

const DB_KEY = process.env.DB_KEY || "listings_app_db";

const storage = new Map();

const getItem = (key) => {
  return storage.get(key);
};

const setItem = (key, value) => {
  storage.set(key, value);
};

export const seedLocalDatabase = () => {
  const database = getItem(DB_KEY);

  if (database) {
    return;
  }

  const initialDatabase = {
    listings,
    locations,
    users,
    reviews,
  };

  setItem(DB_KEY, initialDatabase);
};

export const getDatabase = () => getItem(DB_KEY);
export const updateDatabase = (data) => setItem(DB_KEY, data);
