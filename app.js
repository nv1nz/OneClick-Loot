/* One Click Loots – Client Script */
const API_URL = "https://nv1nz.github.io/OneClick-Loot/cached-deals.json";
const PAGE_SIZE = 30;

let state = {
  allDeals: [],
  filtered: [],
  page: 0,
};

/* Helpers */
function secondsRemaining(endDate) {
  const diff = new Date(endDate) - Date.now();
  return Math.floor(diff / 1000);
}

function formatDuration(seconds) {
  if (seconds <= 0) return 'Ended';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

/* Render */
const grid = document.getElementById('grid');
const template = document.getElementById('card-template');
function renderPage() {
  const start = state.page * PAGE_SIZE;
  const items = state.filtered.slice(start, start + PAGE_SIZE);
  items.forEach(deal => {
    const card = template.content.cloneNode(true);
    const img = card.querySelector('.cover');
    const dealType = card.querySelector('.deal-type');
    const countdown = card.querySelector('.countdown');
    const button = card.querySelector('.claim-btn');

    img.src = deal.image;
    img.alt = deal.title;
    dealType.textContent = deal.worth === 'N/A' ? 'Free' : deal.worth + ' off';
    button.href = deal.open_giveaway_url;

    // initial countdown text
    if (deal.end_date && deal.end_date !== 'N/A') {
      countdown.textContent = 'Ends in ' + formatDuration(secondsRemaining(deal.end_date));
      // Update timer every minute
      const interval = setInterval(() => {
        const secs = secondsRemaining(deal.end_date);
        if (secs <= 0) { countdown.textContent = 'Ended'; clearInterval(interval); }
        else { countdown.textContent = 'Ends in ' + formatDuration(secs); }
      }, 60000);
    } else {
      countdown.textContent = 'No expiry';
    }

    grid.appendChild(card);
  });
  state.page++;
}

/* Infinite scroll sentinel */
const sentinel = document.getElementById('sentinel');
const io = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    if (state.page * PAGE_SIZE < state.filtered.length) {
      renderPage();
    }
  }
});
io.observe(sentinel);

/* Filters */
function applyFilters() {
  const term = document.getElementById('search').value.toLowerCase();
  const platform = document.getElementById('platformFilter').value;
  state.filtered = state.allDeals.filter(d => {
    const matchesTerm = d.title.toLowerCase().includes(term);
    const matchesPlat = platform ? d.platforms.toLowerCase().includes(platform) : true;
    return matchesTerm && matchesPlat;
  });
  // Reset
  grid.innerHTML = '';
  state.page = 0;
  renderPage();
}

/* Event listeners */
document.getElementById('search').addEventListener('input', () => {
  applyFilters();
});
document.getElementById('platformFilter').addEventListener('change', () => {
  applyFilters();
});

/* Startup */
(async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    // Sort freebies first, then by soonest expiry
    state.allDeals = data.sort((a,b) => {
      const aFree = a.worth === 'N/A';
      const bFree = b.worth === 'N/A';
      if (aFree && !bFree) return -1;
      if (!aFree && bFree) return 1;
      return secondsRemaining(a.end_date) - secondsRemaining(b.end_date);
    });
    applyFilters();
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p style="color:#fff">Failed to load deals. Please try again later.</p>';
  }
})();
