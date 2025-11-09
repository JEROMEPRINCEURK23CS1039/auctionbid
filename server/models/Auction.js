const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    itemCategory: {
      type: String,
      required: true,
      trim: true
    },
    startingBid: {
      type: Number,
      required: true,
      min: 0
    },
    currentBid: {
      type: Number,
      required: true,
      min: 0,
      default: function() {
        return this.startingBid;
      }
    },
    bidderName: {
      type: String,
      default: null
    },
    auctionEndDate: {
      type: Date,
      required: true
    },
    itemDescription: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Auction', auctionSchema);
