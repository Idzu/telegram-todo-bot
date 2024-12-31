import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';

class User extends Model {
  declare id: number;
  declare name: string;
  declare UserSettings: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'User',
  },
);

export default User;
