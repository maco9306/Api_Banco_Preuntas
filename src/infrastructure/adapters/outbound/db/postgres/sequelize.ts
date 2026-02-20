import { Sequelize } from "sequelize";
import { env } from "../../../../config/env";

export class SequelizeSingleton {
  private static instance: Sequelize;

  private constructor() {}

  static get(): Sequelize {
    if (!SequelizeSingleton.instance) {
      SequelizeSingleton.instance = new Sequelize(
        env.DB_NAME,
        env.DB_USER,
        env.DB_PASSWORD,
        {
          host: env.DB_HOST,
          port: env.DB_PORT,
          dialect: "postgres",
          logging: false,
          dialectOptions: {
            ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
          },
          pool: {
            max: 10,
            min: 0,
            idle: 30_000,
            acquire: 60_000,
          },
        }
      );
    }

    return SequelizeSingleton.instance;
  }
}