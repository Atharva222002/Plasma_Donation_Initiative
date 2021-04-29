const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const ejs = require('ejs');
const bodyParser = require('body-parser')
// load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// Routes
app.use('/', require('./routes'));

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
