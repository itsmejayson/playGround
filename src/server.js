require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const express = require('express');
const path = require('path');


connectDB();

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, '..', 'public')));


// (optional) fallback route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
