import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";
import MeetingModel, { MeetingAttributes, MeetingInstance } from "./models/meeting"; // Ajusta las importaciones según la estructura de tu modelo

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env as unknown as {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_NAME: string;
};

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false,
    native: false,
    dialectModule: pg,
  }
);

MeetingModel(sequelize);

const {
  models: { Meeting },
} = sequelize;

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
