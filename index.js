const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables as soon as possible so modules that rely on them
// (for example modules that instantiate PrismaClient at import time) have
// access to process.env values like DATABASE_URL.
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Require routes after dotenv has been loaded and after `app` exists.
const authRoute = require('./src/routes/authRoute');
app.use('/api/auth', authRoute);

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));