const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');

// GET /api/viewAll - Retrieve all auctions
router.get('/viewAll', async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    
    if (!auctions || auctions.length === 0) {
      return res.status(200).json({
        message: 'No auctions found',
        data: []
      });
    }
    
    res.status(200).json({
      message: 'Auctions retrieved successfully',
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving auctions',
      message: error.message
    });
  }
});

// POST /api/addNew - Add a new auction
router.post('/addNew', async (req, res) => {
  try {
    const { itemName, itemCategory, startingBid, auctionEndDate, itemDescription } = req.body;
    
    // Validation
    if (!itemName || !itemCategory || startingBid === undefined || !auctionEndDate || !itemDescription) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['itemName', 'itemCategory', 'startingBid', 'auctionEndDate', 'itemDescription']
      });
    }
    
    if (startingBid < 0) {
      return res.status(400).json({
        error: 'Starting bid must be a positive number'
      });
    }
    
    const newAuction = new Auction({
      itemName,
      itemCategory,
      startingBid,
      currentBid: startingBid,
      auctionEndDate,
      itemDescription
    });
    
    await newAuction.save();
    
    res.status(201).json({
      message: 'Auction created successfully',
      data: newAuction
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating auction',
      message: error.message
    });
  }
});

// POST /api/placeBid - Place a bid on an auction
router.post('/placeBid', async (req, res) => {
  try {
    const { auctionId, bidAmount, bidderName } = req.body;
    
    // Validation
    if (!auctionId || bidAmount === undefined || !bidderName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['auctionId', 'bidAmount', 'bidderName']
      });
    }
    
    if (bidAmount <= 0) {
      return res.status(400).json({
        error: 'Bid amount must be greater than 0'
      });
    }
    
    // Find the auction
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({
        error: 'Auction not found'
      });
    }
    
    // Check if auction has ended
    if (new Date() > auction.auctionEndDate) {
      return res.status(400).json({
        error: 'Auction has already ended'
      });
    }
    
    // Check if bid is higher than current bid
    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({
        error: `Bid amount must be greater than current bid of $${auction.currentBid}`
      });
    }
    
    // Update the auction with new bid
    auction.currentBid = bidAmount;
    auction.bidderName = bidderName;
    
    await auction.save();
    
    res.status(200).json({
      message: 'Bid placed successfully',
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error placing bid',
      message: error.message
    });
  }
});

// POST /api/deleteItem - Delete an auction item
router.post('/deleteItem', async (req, res) => {
  try {
    const { auctionId } = req.body;
    
    // Validation
    if (!auctionId) {
      return res.status(400).json({
        error: 'Missing required field',
        required: ['auctionId']
      });
    }
    
    // Find and delete the auction
    const deletedAuction = await Auction.findByIdAndDelete(auctionId);
    
    if (!deletedAuction) {
      return res.status(404).json({
        error: 'Auction not found'
      });
    }
    
    res.status(200).json({
      message: 'Auction deleted successfully',
      data: deletedAuction
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting auction',
      message: error.message
    });
  }
});

module.exports = router;
