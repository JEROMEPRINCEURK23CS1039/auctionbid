const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/auctionDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Mongoose Schema and Model
const auctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemCategory: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  bidderName: { type: String, default: "No bids yet" },
  auctionEndDate: { type: String, required: true },
  itemDescription: { type: String, required: true },
});

const Auction = mongoose.model("Auction", auctionSchema, "auctions");

// API Routes

// Test Route
app.get("/", (req, res) => {
  res.send("🔨 Auction Server API is running!");
});

// Get all auction items
app.get("/api/viewAll", async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ status: "Error fetching auctions" });
  }
});

// Add new auction item
app.post("/api/addNew", async (req, res) => {
  try {
    const {
      itemName,
      itemCategory,
      startingBid,
      auctionEndDate,
      itemDescription,
    } = req.body;

    const newAuction = new Auction({
      itemName: itemName.trim(),
      itemCategory: itemCategory.trim(),
      startingBid: Number(startingBid),
      currentBid: Number(startingBid),
      auctionEndDate: auctionEndDate.trim(),
      itemDescription: itemDescription.trim(),
    });

    await newAuction.save();
    res.json({ status: "Auction item added successfully!" });
  } catch (err) {
    res.json({ status: err.message });
  }
});

// Place a bid on an item
app.post("/api/placeBid", async (req, res) => {
  try {
    const { id, bidAmount, bidderName } = req.body;

    const auction = await Auction.findById(id);
    if (!auction) {
      return res.json({ status: "Auction not found" });
    }

    if (Number(bidAmount) <= auction.currentBid) {
      return res.json({
        status: `Bid must be higher than current bid of ₹${auction.currentBid}`,
      });
    }

    auction.currentBid = Number(bidAmount);
    auction.bidderName = bidderName.trim();
    await auction.save();

    res.json({ status: "Bid placed successfully!" });
  } catch (err) {
    res.json({ status: "Error placing bid" });
  }
});

// Delete an auction item
app.post("/api/deleteItem", async (req, res) => {
  try {
    const { id } = req.body;
    await Auction.findByIdAndDelete(id);
    res.json({ status: "Auction item deleted successfully" });
  } catch (err) {
    res.json({ status: "Error deleting auction item" });
  }
});

// Start Server
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
