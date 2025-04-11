const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Health check endpoint.
 * @route GET /healthCheck
 * @returns {Object} 200 - Returns { status: "OK" }
 */
app.get('/healthCheck', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

/**
 * Main endpoint to fetch drug pricing from 4 sources.
 * @route GET /drugPrices
 * @queryparam {string} drugName - Name of the drug to search for
 * @queryparam {string} zipCode - ZIP code of the location to search
 * @returns {Object} 200 - Pricing data from 4 sources or appropriate error message
 */
app.get('/drugPrices', async (req, res) => {
  const { drugName, zipCode } = req.query;

  if (!drugName || !zipCode) {
    return res.status(400).json({ error: 'Missing drugName or zipCode' });
  }

  try {
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

/**
 * Simulated API call to Source 1.
 * @param {string} drug - Drug name
 * @param {string} zip - ZIP code
 * @returns {Promise<Object>} Pricing data
 */
async function getPriceFromSource1(drug, zip) {
  const apiKey = process.env.SOURCE1_API_KEY;
  const response = await axios.get('https://api.mocksource1.com/prices', {
    params: { drug, zip },
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  return response.data;
}

/**
 * Mock data from Source 2.
 * @param {string} drug - Drug name
 * @param {string} zip - ZIP code
 * @returns {Promise<Object>}
 */
async function getPriceFromSource2(drug, zip) {
  return { price: 14.99, pharmacy: "Mock Pharmacy 2" };
}

/**
 * Mock data from Source 3.
 * @param {string} drug - Drug name
 * @param {string} zip - ZIP code
 * @returns {Promise<Object>}
 */
async function getPriceFromSource3(drug, zip) {
  return { price: 12.49, pharmacy: "Mock Pharmacy 3" };
}

/**
 * Mock data from Source 4.
 * @param {string} drug - Drug name
 * @param {string} zip - ZIP code
 * @returns {Promise<Object>}
 */
async function getPriceFromSource4(dr
