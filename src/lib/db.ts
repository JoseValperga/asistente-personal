import pg from "pg";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import MeetingModel from "./models/meeting";
import { EnvVariables } from "@/utils/interfaces";
dotenv.config();

const getEnvVariables = (): EnvVariables => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

  if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
    throw new Error("Missing required environment variables");
  }

  return {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
  };
};

const env = getEnvVariables();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = env;

const temp: string = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

const sequelize = new Sequelize(temp, {
  logging: false,
  native: false,
  dialectModule: pg,
});

MeetingModel(sequelize);

const { Meeting } = sequelize.models;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { Meeting, connectDB };
