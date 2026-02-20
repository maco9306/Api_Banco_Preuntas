import { DataTypes, Model, Optional } from "sequelize";
import { SequelizeSingleton } from "./sequelize";

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public nombre!: string;
  public email!: string;
  public passwordHash!: string;
}

const sequelize = SequelizeSingleton.get();

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);