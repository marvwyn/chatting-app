
const { DataTypes,Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');
class Chat extends Model {}
Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        to_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: false
    }
);

User.hasMany(Chat, { foreignKey: 'user_id' });
User.hasMany(Chat, { foreignKey: 'to_user_id' });
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'sender' });
Chat.belongsTo(User, { foreignKey: 'to_user_id', as: 'receiver' });

module.exports = Chat;
