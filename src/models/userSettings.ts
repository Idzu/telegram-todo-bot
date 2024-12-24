import { DataTypes, Model } from 'sequelize';
import db from '../utils/db';
import User from './user';

class UserSettings extends Model {
  declare id: number;
  declare userId: number;
  declare timezone: string;
  declare notificationTimes: string;
}

UserSettings.init(
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
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC+4',
    },
    notificationTimes: {
      type: DataTypes.TEXT,
      defaultValue: JSON.stringify(['09:00', '12:00', '15:00', '17:00']),
    },
  },
  {
    sequelize: db,
    modelName: 'UserSettings',
  },
);

UserSettings.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(UserSettings, { foreignKey: 'userId' });

export default UserSettings;
