const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();



// Middleware
app.use(express.json());
app.use(cors());



// Database Connection & Server Startup
mongoose.connect(process.env.MONGO_URI )
  .then(() => {
    console.log('MongoDB Connected Successfully');
    const PORT = process.env.PORT ;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));

  // Import Routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use Routes
app.use('/api/auth', );
app.use('/api/notes', );
app.use('/api/admin', );