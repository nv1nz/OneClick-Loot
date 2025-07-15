/* One Click Loots – Client Script */
const API_URL   = "https://nv1nz.github.io/OneClick-Loot/cached-deals.json";
const PAGE_SIZE = 100;

/*  🔥  NEW: keywords for well‑known games */
const popularKeywords = [
  'gta', 'fortnite', 'witcher', 'far cry', 'hitman',
  'tomb raider', 'assassin', 'metro', 'lego',
  'watch dogs', 'batman', 'just cause', 'payday',
  'sims', 'mass effect', 'dead space', 'mad max',
  'cyberpunk', 'subnautica', 'portal', 'fifa', 'nba', 'call of duty'
];

let state = { allDeals: [], filtered: [], page: 0 };

/* Helpers … (unchanged) */
/* ... keep the rest of your helper + render code exactly the same ... */

/* Startup */
(async () => {
  try {
    const res  = await fetch(API_URL);
    const data = await res.json();

    /*  🔥  Sort freebies first, THEN popular, THEN soonest‑expiring */
    state.allDeals = data.sort((a, b) => {
      const aFree = a.worth === 'N/A',
            bFree = b.worth === 'N/A';

      /* free before discounted */
      if (aFree && !bFree) return -1;
      if (!aFree && bFree) return  1;

      /* among same price‑type, popular keywords first */
      const aPop = popularKeywords.some(k => a.title.toLowerCase().includes(k)),
            bPop = popularKeywords.some(k => b.title.toLowerCase().includes(k));

      if (aPop && !bPop) return -1;
      if (!aPop && bPop) return  1;

      /* finally, the one that ends sooner comes first */
      return secondsRemaining(a.end_date) - secondsRemaining(b.end_date);
    });

    applyFilters();
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p style="color:#fff">Failed to load deals. Please try again later.</p>';
  }
})();
