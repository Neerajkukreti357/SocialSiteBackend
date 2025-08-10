require('dotenv').config(); // Load env vars

const app = require('./app');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT not set

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});