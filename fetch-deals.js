// fetch-deals.js – downloads the latest free‑game deals
const fs   = require('fs');
const https = require('https');

https.get('https://www.gamerpower.com/api/giveaways', res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    fs.writeFileSync('cached-deals.json', data);
    console.log('✅ cached-deals.json updated');
  });
}).on('error', err => {
  console.error('❌ fetch error:', err);
  process.exit(1);
});
