const path = require('path');
const fs = require('fs');

// Load env from ./ .env or repo root fallback
const localEnv = path.join(__dirname, '.env');
const rootEnv = path.join(__dirname, '..', '..', '.env');
const dotenv = require('dotenv');

if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  dotenv.config(); // default
}
const express = require('express');
const { Client } = require('@xdevplatform/xdk');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getBearerToken() {
  const token = process.env.BEARER_TOKEN;
  if (!token) {
    throw new Error('BEARER_TOKEN env var is required');
  }
  return token;
}

function mapErrorStatus(status) {
  if (status === 401) return 'Unauthorized (check BEARER_TOKEN)';
  if (status === 429) return 'Rate limited';
  if (status >= 400 && status < 500) return 'Invalid request';
  return 'Server error';
}

app.post('/api/search', async (req, res) => {
  const { query, limit = 10 } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const client = new Client({ bearerToken: getBearerToken() });
    const maxResults = Math.min(Math.max(limit || 10, 10), 100); // API min 10, max 100

    const apiRes = await client.posts.searchRecent(query, {
      maxResults,
      tweetFields: ['author_id', 'created_at', 'public_metrics'],
      userFields: ['username', 'name', 'profile_image_url'],
      expansions: ['author_id']
    });

    const users = new Map((apiRes.includes?.users || []).map((u) => [u.id, u]));
    const posts = (apiRes.data || []).slice(0, limit || 10).map((p) => {
      const author = users.get(p.author_id) || {};
      return {
        id: p.id,
        text: p.text,
        created_at: p.created_at,
        author: {
          id: author.id || p.author_id,
          username: author.username || '',
          name: author.name || ''
        },
        public_metrics: p.public_metrics || {}
      };
    });

    return res.json({ data: posts, meta: apiRes.meta || {} });
  } catch (err) {
    const status = err.status || 500;
    const message = mapErrorStatus(status);
    const details = err.data || err.message;
    console.error('search_recent error', err);
    return res.status(status).json({ error: message, details });
  }
});

app.listen(port, () => {
  console.log(`search-recent UI running at http://localhost:${port}`);
});
