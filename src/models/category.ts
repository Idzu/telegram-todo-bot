import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';
import User from './user';

class Category extends Model {
  declare id: number;
  declare name: string;
  declare userId: number;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Category',
  },
);

Category.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Category, { foreignKey: 'userId' });

export default Category;
