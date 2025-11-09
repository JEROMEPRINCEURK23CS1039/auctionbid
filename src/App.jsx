import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://auctionbid-backend.onrender.com/api";

function App() {
  // State management
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    startingBid: "",
    auctionEndDate: "",
    itemDescription: "",
  });

  // Bid modal state
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidData, setBidData] = useState({
    bidAmount: "",
    bidderName: "",
  });
  const [bidError, setBidError] = useState("");

  // Fetch all auctions on component mount
  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // API Calls
  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/viewAll`);
      setAuctions(response.data.data || []);
      setError("");
    } catch (err) {
      setError(
        "Failed to fetch auctions: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Error fetching auctions:", err);
    }
  };

  const handleAddAuction = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.itemName.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.itemCategory.trim()) {
      setError("Item category is required");
      return;
    }
    if (!formData.startingBid || formData.startingBid <= 0) {
      setError("Starting bid must be greater than 0");
      return;
    }
    if (!formData.auctionEndDate) {
      setError("Auction end date is required");
      return;
    }
    if (!formData.itemDescription.trim()) {
      setError("Item description is required");
      return;
    }

    // Check if end date is in the future
    if (new Date(formData.auctionEndDate) <= new Date()) {
      setError("Auction end date must be in the future");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/addNew`, {
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        startingBid: parseFloat(formData.startingBid),
        auctionEndDate: new Date(formData.auctionEndDate).toISOString(),
        itemDescription: formData.itemDescription,
      });

      setSuccess("Auction created successfully!");
      setFormData({
        itemName: "",
        itemCategory: "",
        startingBid: "",
        auctionEndDate: "",
        itemDescription: "",
      });
      setError("");
      fetchAuctions();
    } catch (err) {
      setError(
        "Failed to create auction: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Error creating auction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBidModal = (auction) => {
    setSelectedAuction(auction);
    setBidData({ bidAmount: "", bidderName: "" });
    setBidError("");
    setShowBidModal(true);
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");

    // Validation
    if (!bidData.bidderName.trim()) {
      setBidError("Bidder name is required");
      return;
    }
    if (!bidData.bidAmount || bidData.bidAmount <= 0) {
      setBidError("Bid amount must be greater than 0");
      return;
    }
    if (parseFloat(bidData.bidAmount) <= selectedAuction.currentBid) {
      setBidError(
        `Bid must be higher than current bid of $${selectedAuction.currentBid}`
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/placeBid`, {
        auctionId: selectedAuction._id,
        bidAmount: parseFloat(bidData.bidAmount),
        bidderName: bidData.bidderName,
      });

      setSuccess("Bid placed successfully!");
      setShowBidModal(false);
      fetchAuctions();
    } catch (err) {
      setBidError(
        "Failed to place bid: " + (err.response?.data?.error || err.message)
      );
      console.error("Error placing bid:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (window.confirm("Are you sure you want to delete this auction?")) {
      setLoading(true);
      try {
        await axios.post(`${API_BASE_URL}/deleteItem`, {
          auctionId: auctionId,
        });

        setSuccess("Auction deleted successfully!");
        setError("");
        fetchAuctions();
      } catch (err) {
        setError(
          "Failed to delete auction: " +
            (err.response?.data?.message || err.message)
        );
        console.error("Error deleting auction:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAuctionEnded = (endDate) => {
    return new Date() > new Date(endDate);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getStatusBadge = (auction) => {
    if (isAuctionEnded(auction.auctionEndDate)) {
      return <span className="badge bg-secondary">Ended</span>;
    }
    return <span className="badge bg-success">Active</span>;
  };

  const getBidBadgeClass = (auction) => {
    if (auction.bidderName) {
      return "badge-primary";
    }
    return "badge-warning";
  };

  return (
    <div className="min-vh-100 py-5 px-3 px-md-5">
      <div className="container-fluid">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="auction-title display-4 mb-2">🏆 Online Auction Hub</h1>
          <p className="text-muted fs-5">
            Buy and sell items through live auctions
          </p>
        </div>

        {/* Alert Messages */}
        {success && (
          <div
            className="alert alert-success alert-dismissible fade show mb-4"
            role="alert"
          >
            <strong>Success!</strong> {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show mb-4"
            role="alert"
          >
            <strong>Error!</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        <div className="row g-4">
          {/* Add Auction Form */}
          <div className="col-lg-4">
            <div className="card shadow-lg h-100 border-0">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0">📝 Add New Auction</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddAuction}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Vintage Watch"
                      value={formData.itemName}
                      onChange={(e) =>
                        setFormData({ ...formData, itemName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={formData.itemCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          itemCategory: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Collectibles">Collectibles</option>
                      <option value="Art">Art</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Books">Books</option>
                      <option value="Sports">Sports</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Starting Bid ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      value={formData.startingBid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startingBid: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Auction End Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.auctionEndDate}
                      min={getMinDateTime()}
                      step="60"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          auctionEndDate: e.target.value,
                        })
                      }
                      required
                    />
                    <small className="text-muted">
                      Select a future date and time
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Describe the item..."
                      rows="3"
                      value={formData.itemDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          itemDescription: e.target.value,
                        })
                      }
                      required
                      minLength="10"
                    ></textarea>
                    <small className="text-muted">
                      Minimum 10 characters
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "✚ Add Auction"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Auctions Table */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-info text-white py-3">
                <h5 className="mb-0">
                  📊 Active Auctions ({auctions.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {auctions.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted fs-5">
                      No auctions available. Create one to get started!
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Item</th>
                          <th>Category</th>
                          <th>Current Bid</th>
                          <th>Bidder</th>
                          <th>Ends</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auctions.map((auction) => (
                          <tr key={auction._id}>
                            <td className="fw-bold">{auction.itemName}</td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {auction.itemCategory}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success fs-6">
                                ${auction.currentBid.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${getBidBadgeClass(
                                  auction
                                )} fs-6`}
                              >
                                {auction.bidderName || "No bids"}
                              </span>
                            </td>
                            <td className="small text-muted">
                              {formatDate(auction.auctionEndDate)}
                            </td>
                            <td>{getStatusBadge(auction)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() =>
                                  handleOpenBidModal(auction)
                                }
                                disabled={
                                  isAuctionEnded(auction.auctionEndDate) ||
                                  loading
                                }
                                title="Place a bid"
                              >
                                💰 Bid
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleDeleteAuction(auction._id)
                                }
                                disabled={loading}
                                title="Delete auction"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Item Details Accordion */}
            {auctions.length > 0 && (
              <div className="mt-4">
                <div className="accordion" id="auctionDetails">
                  {auctions.map((auction, index) => (
                    <div className="accordion-item" key={auction._id}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="false"
                          aria-controls={`collapse${index}`}
                        >
                          <strong>{auction.itemName}</strong> -{" "}
                          {auction.itemCategory}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#auctionDetails"
                      >
                        <div className="accordion-body">
                          <p>
                            <strong>Description:</strong>{" "}
                            {auction.itemDescription}
                          </p>
                          <p>
                            <strong>Starting Bid:</strong> $
                            {auction.startingBid.toFixed(2)}
                          </p>
                          <p>
                            <strong>Current Bid:</strong> $
                            {auction.currentBid.toFixed(2)}
                          </p>
                          <p>
                            <strong>Highest Bidder:</strong>{" "}
                            {auction.bidderName || "No bids yet"}
                          </p>
                          <p>
                            <strong>Auction Ends:</strong>{" "}
                            {formatDate(auction.auctionEndDate)}
                          </p>
                          {isAuctionEnded(auction.auctionEndDate) && (
                            <p className="text-danger">
                              <strong>⚠️ This auction has ended</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <div
        className={`modal fade ${showBidModal ? "show" : ""}`}
        style={{ display: showBidModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!showBidModal}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">💰 Place Your Bid</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowBidModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedAuction && (
                <>
                  <p className="mb-3">
                    <strong>Item:</strong> {selectedAuction.itemName}
                  </p>
                  <p className="mb-3">
                    <strong>Current Bid:</strong>{" "}
                    <span className="badge bg-success fs-6">
                      ${selectedAuction.currentBid.toFixed(2)}
                    </span>
                  </p>
                  <p className="mb-4">
                    <strong>Highest Bidder:</strong>{" "}
                    <span className="badge bg-primary fs-6">
                      {selectedAuction.bidderName || "No bids yet"}
                    </span>
                  </p>

                  {bidError && (
                    <div className="alert alert-danger" role="alert">
                      {bidError}
                    </div>
                  )}

                  <form onSubmit={handlePlaceBid}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        value={bidData.bidderName}
                        onChange={(e) =>
                          setBidData({
                            ...bidData,
                            bidderName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Your Bid Amount ($)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Must be higher than current bid"
                          step="0.01"
                          min={selectedAuction.currentBid + 0.01}
                          value={bidData.bidAmount}
                          onChange={(e) =>
                            setBidData({
                              ...bidData,
                              bidAmount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <small className="text-muted d-block mt-2">
                        Minimum bid: $
                        {(selectedAuction.currentBid + 0.01).toFixed(2)}
                      </small>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-success fw-bold"
                        disabled={loading}
                      >
                        {loading ? "Placing bid..." : "✓ Place Bid"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowBidModal(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showBidModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowBidModal(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
