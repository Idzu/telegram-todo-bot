import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';

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
    },
  },
  {
    sequelize: db,
    modelName: 'Category',
  },
);

export default Category;
