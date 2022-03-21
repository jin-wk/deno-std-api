import { Model, DataTypes } from "../deps.ts";
import { db } from "../core/database.ts";

export class User extends Model {
  static table = "users";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
  };
}

db.link([User]);
