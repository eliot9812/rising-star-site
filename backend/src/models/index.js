const { sequelize } = require('../config/database');
const Admin = require('./Admin');
const ContactMessage = require('./ContactMessage');
const Admission = require('./Admission');
const Notice = require('./Notice');
const NoticeAttachment = require('./NoticeAttachment');
const GalleryEvent = require('./GalleryEvent');
const GalleryPhoto = require('./GalleryPhoto');

// Define associations - Notice
Notice.hasMany(NoticeAttachment, {
  foreignKey: 'noticeId',
  as: 'attachments',
  onDelete: 'CASCADE'
});
NoticeAttachment.belongsTo(Notice, {
  foreignKey: 'noticeId',
  as: 'notice'
});

// Define associations - Gallery
GalleryEvent.hasMany(GalleryPhoto, {
  foreignKey: 'eventId',
  as: 'photos',
  onDelete: 'CASCADE'
});
GalleryPhoto.belongsTo(GalleryEvent, {
  foreignKey: 'eventId',
  as: 'event'
});

module.exports = {
  sequelize,
  Admin,
  ContactMessage,
  Admission,
  Notice,
  NoticeAttachment,
  GalleryEvent,
  GalleryPhoto
};
