// Test script to check API response
const testSKU = 'SKU-1761896771476'; // From the screenshot

fetch(`http://localhost:3000/api/products/image/${testSKU}`)
  .then(res => res.json())
  .then(data => {
    console.log('API Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err);
  });