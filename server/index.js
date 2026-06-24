const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('DevBoost AI Server is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
