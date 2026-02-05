const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GalleryPhoto = sequelize.define('GalleryPhoto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gallery_events',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  src: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  alt: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Gallery Photo'
  }
}, {
  tableName: 'gallery_photos',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = GalleryPhoto;
