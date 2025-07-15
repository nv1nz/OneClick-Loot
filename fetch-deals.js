// fetch-deals.js – downloads the latest free‑game deals
const fs   = require('fs');
const https = require('https');

/* 🔥 Fetch giveaways from top platforms */
const API_URL = 'https://www.gamerpower.com/api/giveaways?platform=steam,epic,gog&limit=100';

https.get(API_URL, res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    const raw = JSON.parse(data);

    // 🎯 Keywords to prioritize
    const popularKeywords = [
      'fortnite', 'witcher', 'gta', 'far cry', 'hitman',
      'tomb raider', 'assassin', 'metro', 'lego',
      'watch dogs', 'batman', 'just cause', 'payday',
      'sims', 'mass effect', 'dead space', 'mad max',
      'cyberpunk', 'subnautica', 'portal', 'fifa', 'nba', 'call of duty'
    ];

    // Sort: Popular games first
    const sorted = raw.sort((a, b) => {
      const aPop = popularKeywords.some(k => a.title.toLowerCase().includes(k));
      const bPop = popularKeywords.some(k => b.title.toLowerCase().includes(k));
      return bPop - aPop; // b first if it's more popular
    });

    // ✅ Save all games (but popular ones at top)
    fs.writeFileSync('cached-deals.json', JSON.stringify(sorted, null, 2));
    console.log(`✅ Saved ${sorted.length} games (popular first)`);
  });
}).on('error', err => {
  console.error('❌ fetch error:', err);
  process.exit(1);
});
