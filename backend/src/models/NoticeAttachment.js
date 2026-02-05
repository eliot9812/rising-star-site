const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NoticeAttachment = sequelize.define('NoticeAttachment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  noticeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notices',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('image', 'pdf'),
    allowNull: false,
    defaultValue: 'image'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'notice_attachments',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = NoticeAttachment;
