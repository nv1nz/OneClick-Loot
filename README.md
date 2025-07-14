# One Click Loots

Automatically displays the latest free & discounted games across Steam, Epic Games, GOG, itch.io, and more.

## Features
- Tight, image‑only grid layout (30 items per batch) with dark UI  
- Hover overlay shows: **Free / Discount size**, countdown timer, **Claim** button  
- Search bar + platform filter  
- Infinite scroll using Intersection Observer  
- Fully client‑side – fetches https://www.gamerpower.com/api/giveaways at runtime  
- SEO‑ready (meta tags, semantic HTML, JSON‑LD)

## Local dev

```bash
# serve with any static server
npm i -g serve
serve .
```

## Deploy to GitHub Pages

1. Create a new repository called `oneclickloots`.  
2. Commit *all* files.  
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
3. In repo settings, enable **GitHub Pages** to serve from the `main` branch `/root`.  
4. Your site will be live at `https://<username>.github.io/oneclickloots/`.  

### Auto‑refresh deals daily

While the front‑end already fetches live data each visit, you can cache deals daily with a Workflow:

```yaml
# .github/workflows/cache-deals.yml
name: Cache daily deals
on:
  schedule:
    - cron: '0 2 * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch & commit
        run: |
          curl -s https://www.gamerpower.com/api/giveaways > cached-deals.json
          git config user.name github-actions
          git config user.email actions@github.com
          git add cached-deals.json
          git commit -m "Update cached deals $(date -u '+%F')" || echo "No changes"
          git push
```

Configure the front‑end to fetch `cached-deals.json` first, falling back to the live API.

Enjoy never missing a free game again!  
_Last updated: 2025-07-14_
