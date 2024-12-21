import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';

class Task extends Model {
  declare id: number;
  declare userId: number;
  declare text: string;
  declare completed: boolean;
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
  },
  {
    sequelize: db,
    modelName: 'Task',
  },
);

export default Task;
