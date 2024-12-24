import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';
import Category from './category';
import User from './user';

class Task extends Model {
  declare id: number;
  declare userId: number;
  declare text: string;
  declare completed: boolean;
  declare isRecurring: boolean;
  declare categoryId: number | null;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Task',
  },
);

// Определяем связи
Task.belongsTo(User, { foreignKey: 'userId' });
Task.belongsTo(Category, { foreignKey: 'categoryId' });

export default Task;
