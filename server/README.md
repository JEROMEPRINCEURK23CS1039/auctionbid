# Auction App - Express Server

A complete Node.js Express server with MongoDB for managing online auctions.

## Features

- Express.js server running on port 7000
- MongoDB integration with Mongoose ODM
- CORS enabled for cross-origin requests
- Comprehensive error handling
- RESTful API for auction management
- Nodemon for development with auto-reload

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection configuration
├── models/
│   └── Auction.js         # Mongoose schema for auctions
├── routes/
│   └── auctionRoutes.js   # API route handlers
├── server.js              # Main Express server file
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
└── README.md             # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote connection string)
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string if needed:
```
MONGODB_URI=mongodb://localhost:27017/auctionDB
PORT=7000
```

## Running the Server

### Development Mode (with nodemon auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:7000`

## API Endpoints

### 1. Get All Auctions
- **Endpoint:** `GET /api/viewAll`
- **Description:** Retrieve all auctions
- **Response:** Array of auction objects

**Example Request:**
```bash
curl http://localhost:7000/api/viewAll
```

### 2. Add New Auction
- **Endpoint:** `POST /api/addNew`
- **Description:** Create a new auction item
- **Request Body:**
```json
{
  "itemName": "Vintage Watch",
  "itemCategory": "Electronics",
  "startingBid": 50,
  "auctionEndDate": "2025-12-31T23:59:59Z",
  "itemDescription": "A beautiful vintage watch in excellent condition"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:7000/api/addNew \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Vintage Watch",
    "itemCategory": "Electronics",
    "startingBid": 50,
    "auctionEndDate": "2025-12-31T23:59:59Z",
    "itemDescription": "A beautiful vintage watch"
  }'
```

### 3. Place a Bid
- **Endpoint:** `POST /api/placeBid`
- **Description:** Place a bid on an auction
- **Request Body:**
```json
{
  "auctionId": "auction_object_id",
  "bidAmount": 75,
  "bidderName": "John Doe"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:7000/api/placeBid \
  -H "Content-Type: application/json" \
  -d '{
    "auctionId": "your_auction_id",
    "bidAmount": 75,
    "bidderName": "John Doe"
  }'
```

### 4. Delete Auction Item
- **Endpoint:** `POST /api/deleteItem`
- **Description:** Delete an auction item
- **Request Body:**
```json
{
  "auctionId": "auction_object_id"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:7000/api/deleteItem \
  -H "Content-Type: application/json" \
  -d '{
    "auctionId": "your_auction_id"
  }'
```

## Database Schema

### Auction Collection
```javascript
{
  itemName: String (required),
  itemCategory: String (required),
  startingBid: Number (required, min: 0),
  currentBid: Number (required, default: startingBid),
  bidderName: String (nullable),
  auctionEndDate: Date (required),
  itemDescription: String (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

Common error responses:
- `400 Bad Request` - Missing or invalid required fields
- `404 Not Found` - Auction or route not found
- `500 Internal Server Error` - Server error

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017/auctionDB`)
- `PORT`: Server port (default: `7000`)

## Development

The project uses:
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin request handling
- **dotenv** - Environment variable management
- **Nodemon** - Development server auto-reload

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on your system
- Check the `MONGODB_URI` in your `.env` file
- Verify database permissions

### Port Already in Use
- Change the `PORT` in your `.env` file
- Or kill the process using port 7000

### Module Not Found
- Run `npm install` to ensure all dependencies are installed
- Check that you're in the `server` directory

## License

ISC
