## search-recent UI (Node)

Minimal Node/Express + static HTML UI to run X API samples locally.

### Prerequisites
- Node 16.14+ installed
- X API bearer token (app-only) set as `BEARER_TOKEN`

### Setup & Run
```bash
cd javascript/ui
npm install

# Set token (PowerShell example)
$env:BEARER_TOKEN = 'your_token'

# If port 4000 is busy, set a different one
$env:PORT = 4001

npm start
# Open http://localhost:4000 (or your chosen port)
```

### UI Functions
- **Recent Search (custom query)**  
  Enter any query (e.g., `from:x -is:retweet`) and limit (1-100). Uses `/api/search` → `posts.searchRecent`.

- **Lookup by Post ID/URL**  
  Paste a post ID or URL. Uses `/api/lookup` → `posts.getById`.

- **Trending by WOEID**  
  Enter a WOEID (e.g., US `23424977`, UK `23424975`, AU `23424748`, IN `23424910`, IE `23424922`, CA `23424803`, BR `23424775`, IT `23424916`, DE `23424829`, AR `23424747`). Shows trend list with names and volumes. Uses `/api/trends` → `trends.getByWoeid`.

- **Quick Search (trend-dependent)**  
  After clicking a trend card, the quick search fields enable with a prefilled query `<trend> -is:retweet`. You can edit the query and set a limit (min 10, max 100). Uses `/api/search/royal-commission` (generic handler with body `{ query, limit }`) → `posts.searchRecent`.

### Notes
- Requires valid `BEARER_TOKEN`; errors like 401 indicate invalid/expired token.
- API enforces `max_results` minimum of 10; the quick search enforces that.
- If port is in use, set `PORT` env var before `npm start`.
