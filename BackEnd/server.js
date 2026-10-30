const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();



// Middleware
app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Secure Note Taking API is live and running!" });
});

// Health Check Endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('The API is healthy');
});

mongoose.connect(process.env.MONGO_URI )
  .then(() => {
    console.log('MongoDB Connected Successfully');
    const PORT = process.env.PORT ;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));