const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// GET /healthCheck
app.get('/healthCheck', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// GET /drugPrices?drugName=Lisinopril&zipCode=95355
app.get('/drugPrices', async (req, res) => {
  const { drugName, zipCode } = req.query;

  if (!drugName || !zipCode) {
    return res.status(400).json({ error: 'Missing drugName or zipCode' });
  }

  try {
    // Replace with real API URLs
    const sources = [
      getPriceFromSource1(drugName, zipCode),
      getPriceFromSource2(drugName, zipCode),
      getPriceFromSource3(drugName, zipCode),
      getPriceFromSource4(drugName, zipCode)
    ];

    const results = await Promise.allSettled(sources);

    const pricingData = {
      source1: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason.message },
      source2: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason.message },
      source3: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason.message },
      source4: results[3].status === 'fulfilled' ? results[3].value : { error: results[3].reason.message },
    };

    res.json({ drugName, zipCode, pricingData });

  } catch (err) {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- MOCK DATA SOURCE FUNCTIONS ----
// Replace with actual APIs + headers/auth/etc.
async function getPriceFromSource1(drug, zip) {
  // Example external call
  const response = await axios.get(`https://api.mocksource1.com/prices`, {
    params: { drug, zip }
  });
  return response.data;
}

async function getPriceFromSource2(drug, zip) {
  return { price: 14.99, pharmacy: "Mock Pharmacy 2" };
}

async function getPriceFromSource3(drug, zip) {
  return { price: 12.49, pharmacy: "Mock Pharmacy 3" };
}

async function getPriceFromSource4(drug, zip) {
  return { price: 10.99, pharmacy: "Mock Pharmacy 4" };
}

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
