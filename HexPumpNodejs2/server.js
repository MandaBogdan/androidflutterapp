const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parse incoming JSON requests
app.use(bodyParser.json());

// Handle POST requests to /api/upload
app.post('/api/upload', (req, res) => {
  // Access the uploaded image using req.body
  const base64Image = req.body.image;

  // Your image handling logic here

  // Send a response
  res.status(200).json({ message: 'Image uploaded successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});