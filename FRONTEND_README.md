# Online Auction Hub - Frontend

A modern, responsive React + Vite + Bootstrap 5 frontend for a real-time online auction platform.

## 🎯 Features

### User Interface
- **Add Auction Form** - Create new auction items with validation
- **Live Auction Table** - Display all active auctions with real-time updates
- **Bid Modal** - Place bids with validation (must be higher than current bid)
- **Delete Function** - Remove auction items with confirmation
- **Color-Coded Display** - Visual indicators for bid status
- **Accordion Details** - Expandable item descriptions and details
- **Auto-Refresh** - Auctions update every 5 seconds
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Form Validation
- Item name, category, starting bid, end date, and description are required
- Starting bid must be positive
- Auction end date must be in the future
- Bid amount must be higher than current bid
- Bidder name is required

### Color-Coded Elements
- **Green Badge** - Current bid amount (success)
- **Primary Badge** - Bidder with highest bid
- **Warning Badge** - No bids placed yet
- **Secondary Badge** - Auction ended
- **Light Badge** - Item category

## 🛠️ Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Bootstrap 5.3.8 + Custom CSS
- **HTTP Client**: Axios 1.13.2
- **State Management**: React Hooks (useState, useEffect)

## 📦 Installation

1. Navigate to the project directory:
```bash
cd Weblab8
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

## 🚀 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm build

# Preview production build
npm run preview

# Lint JavaScript code
npm run lint
```

## 🔌 API Integration

The frontend connects to the Node.js backend at `http://localhost:7000`

### API Endpoints Used

1. **GET /api/viewAll**
   - Fetches all auctions
   - Called on component mount and every 5 seconds

2. **POST /api/addNew**
   - Creates a new auction
   - Payload: itemName, itemCategory, startingBid, auctionEndDate, itemDescription

3. **POST /api/placeBid**
   - Places a bid on an auction
   - Payload: auctionId, bidAmount, bidderName
   - Validation: Bid must be higher than current bid

4. **POST /api/deleteItem**
   - Deletes an auction item
   - Payload: auctionId

## 📱 Responsive Breakpoints

- **Desktop (≥992px)**: Full layout with side-by-side form and table
- **Tablet (768px - 991px)**: Optimized spacing and font sizes
- **Mobile (<768px)**: Stacked layout with smaller buttons

## 🎨 Styling

### Colors
- **Primary**: #667eea (Purple)
- **Secondary**: #764ba2 (Dark Purple)
- **Success**: #11998e / #38ef7d (Teal Green)
- **Danger**: #eb3b5a (Red)
- **Warning**: #ffc107 (Yellow)

### Components
- Cards with hover effects and smooth shadows
- Gradient buttons with smooth transitions
- Custom scrollbar styling
- Badge system for visual hierarchy

## 🔄 Auto-Refresh

The application automatically fetches updated auctions every 5 seconds:

```javascript
useEffect(() => {
  const interval = setInterval(fetchAuctions, 5000);
  return () => clearInterval(interval);
}, []);
```

## ⚠️ Error Handling

- Toast-like alert messages for success and error
- Automatic message dismissal after 5 seconds
- Form validation with user-friendly error messages
- Network error handling with clear feedback
- Bid validation with specific error messages

## 🔒 Security Features

- Input validation on all forms
- CORS enabled communication with backend
- Confirmation dialog for destructive actions (delete)
- XSS protection through React's built-in sanitization

## 📋 Form Fields

### Add Auction Form
- **Item Name** - Text input (required)
- **Category** - Dropdown select with predefined options
- **Starting Bid** - Number input with decimal support
- **Auction End Date** - DateTime input
- **Description** - Textarea for item details

### Place Bid Form
- **Your Name** - Text input (required)
- **Bid Amount** - Number input with minimum validation

## 🎯 Project Structure

```
src/
├── App.jsx          # Main component with all auction logic
├── App.css          # Comprehensive styling
├── main.jsx         # React entry point
├── index.css        # Global styles
└── [other files]

index.html          # HTML template
vite.config.js      # Vite configuration
package.json        # Dependencies and scripts
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized `dist` folder ready for deployment.

### Deploy to Static Hosting
- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Use `gh-pages` package
- **Firebase**: Use Firebase Hosting

## ⚙️ Configuration

### Backend URL
To change the backend URL, update the constant in `App.jsx`:

```javascript
const API_BASE_URL = "http://localhost:7000/api";
```

### Auto-Refresh Interval
To change the refresh interval (currently 5 seconds):

```javascript
const interval = setInterval(fetchAuctions, 5000); // Change 5000 to desired milliseconds
```

## 🐛 Troubleshooting

### CORS Errors
Ensure the backend server is running and CORS is enabled:
```javascript
app.use(cors());
```

### Port Already in Use
Vite uses port 5173 by default. To use a different port:
```bash
npm run dev -- --port 3000
```

### Blank Page or 404
- Ensure `index.html` exists in the root directory
- Check that `main.jsx` is properly imported
- Clear browser cache (Ctrl+Shift+Delete)

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Bootstrap Documentation](https://getbootstrap.com)
- [Axios Documentation](https://axios-http.com)

## 📄 License

ISC

## 👨‍💻 Development Tips

1. **Hot Module Replacement (HMR)** - Vite automatically updates the browser when you save changes
2. **React DevTools** - Install React DevTools browser extension for debugging
3. **Network Tab** - Use browser DevTools Network tab to monitor API calls
4. **Console Errors** - Check browser console for JavaScript errors
5. **Responsive Design** - Use browser DevTools device emulation to test on different screen sizes

## 🤝 Contributing

Feel free to fork, modify, and improve the project!

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Verify backend server is running on port 7000
4. Check network requests in DevTools

---

**Happy Bidding! 🎉**
