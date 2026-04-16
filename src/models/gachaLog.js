const mongoose = require('mongoose');

const gachaLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    prize: {
      type: String,
      default: null, // null = tidak menang hadiah
    },
    gachaAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GachaLog', gachaLogSchema);