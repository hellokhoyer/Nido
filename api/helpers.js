import fs from "fs";
import * as jose from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY);

// Simple in-memory database for development
let memoryDatabase = {};
const DATABASE_FILE = "./database.json";

// Load database from file if exists
const loadDatabase = () => {
  try {
    if (fs.existsSync(DATABASE_FILE)) {
      const data = fs.readFileSync(DATABASE_FILE, "utf8");
      memoryDatabase = JSON.parse(data);
    }
  } catch (error) {
    console.log("No existing database file found, starting fresh");
    memoryDatabase = {};
  }
};

// Save database to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(memoryDatabase, null, 2));
  } catch (error) {
    console.error("Error saving database:", error);
  }
};

// Initialize database
loadDatabase();

// Waits for a given number of milliseconds
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to easily retrieve a database table
export const getDatabaseTable = (entity) => {
  return memoryDatabase[entity] || null;
};

export const setDatabaseTable = (entity, data) => {
  memoryDatabase[entity] = data;
  saveDatabase();
};

// Removes the password from a user object
export const cleanUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// Wrapper for axios mock adapter that adds authentication checks
export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.headers.Authorization?.split(" ")[1];

    // Verifies access token if present
    const verified = token ? await verifyToken(token) : false;

    // Returns 403 if token is invalid and auth is enabled
    if (process.env.USE_AUTH && !verified) {
      return [401, { message: "Unauthorized" }];
    }

    // Calls the original mock function
    return typeof data[0] === "function" ? data[0](config) : data;
  };

// Verifies a JWT token
export const verifyToken = async (token, options = undefined) => {
  try {
    const verification = await jose.jwtVerify(token, jwtSecret);
    return options?.returnPayload ? verification.payload : true;
  } catch {
    return false;
  }
};

// Generates a refresh token with a 30 day expiration
export const generateRefreshToken = async (userId) => {
  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(jwtSecret);
};

// Generates an access token with a 15 minute expiration
export const generateAccessToken = async (userId) => {
  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(jwtSecret);
};
