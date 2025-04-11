const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Health Check Endpoint
app.get('/healthCheck', (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ✅ Example of using Axios in a GET request
app.get('/external', async (req, res) => {
  try {
    const response = await axios.get('https://api.publicapis.org/entries');
    res.json(response.data); // Return the external data
  } catch (error) {
    console.error('Axios error:', error.message);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

// ✅ HTTP Methods Example
app.get('/example', (req, res) => res.send('GET request received'));
app.post('/example', (req, res) => res.send('POST request received'));
app.put('/example', (req, res) => res.send('PUT request received'));
app.delete('/example', (req, res) => res.send('DELETE request received'));
app.patch('/example', (req, res) => res.send('PATCH request received'));
app.options('/example', (req, res) => {
  res.set('Allow', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.send('OPTIONS request received');
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
