const express = require('express');
const db = require("./config/db");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const offerRoutes = require('./routes/offersRoutes');
const packageRoutes = require('./routes/packagesRoutes');
const subAdminRoutes = require('./routes/subadminRoutes')
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Example: Other routes or middleware here
app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/subadmin', subAdminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
