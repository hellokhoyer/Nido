import fs from "fs";
import * as jose from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "hellokhoyer";
const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY);

let memoryDatabase = {};
const DATABASE_FILE = "./database.json";

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

const saveDatabase = () => {
  try {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(memoryDatabase, null, 2));
  } catch (error) {
    console.error("Error saving database:", error);
  }
};

loadDatabase();

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDatabaseTable = (entity) => {
  return memoryDatabase[entity] || null;
};

export const setDatabaseTable = (entity, data) => {
  memoryDatabase[entity] = data;
  saveDatabase();
};

export const cleanUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.headers.Authorization?.split(" ")[1];

    const verified = token ? await verifyToken(token) : false;

    if (process.env.USE_AUTH && !verified) {
      return [401, { message: "Unauthorized" }];
    }

    return typeof data[0] === "function" ? data[0](config) : data;
  };

export const verifyToken = async (token, options = undefined) => {
  try {
    const verification = await jose.jwtVerify(token, jwtSecret);
    return options?.returnPayload ? verification.payload : true;
  } catch {
    return false;
  }
};

export const generateRefreshToken = async (data) => {
  return await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(jwtSecret);
};

export const generateAccessToken = async (data) => {
  return await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(jwtSecret);
};
