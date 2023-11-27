const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest', // mode Dev, product: process.env.GEOCODE_PROVIDER
    httpAdapter: 'https',
    apiKey: 'yPHWI7sChAEUskWEm6q68v37Sbom0wAI', // mode Dev, product: process.env.GEOCODE_API_KEY
    formatter: null
};


// Create Instance NodeGeocoder
const geocoder = NodeGeocoder(options);

module.exports = geocoder;
