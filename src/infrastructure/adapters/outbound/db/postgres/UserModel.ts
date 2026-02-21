import { DataTypes, Model, Optional } from "sequelize";
import { SequelizeSingleton } from "./sequelize";

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password_hash!: string;
}

const sequelize = SequelizeSingleton.get();

UserModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: true,
    underscored: true
  }
);