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

async function getClient() {
  return new Client({ bearerToken: getBearerToken() });
}

app.post('/api/search', async (req, res) => {
  const { query, limit = 10 } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const client = await getClient();
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

app.post('/api/lookup', async (req, res) => {
  const { id } = req.body || {};
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    const client = await getClient();
    const apiRes = await client.posts.getById(id, {
      tweetFields: ['author_id', 'created_at', 'public_metrics'],
      userFields: ['username', 'name', 'profile_image_url'],
      expansions: ['author_id']
    });

    const tweet = Array.isArray(apiRes.data) ? apiRes.data[0] : apiRes.data;
    if (!tweet) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const users = new Map((apiRes.includes?.users || []).map((u) => [u.id, u]));
    const author = users.get(tweet.author_id) || {};
    const post = {
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      author: {
        id: author.id || tweet.author_id,
        username: author.username || '',
        name: author.name || ''
      },
      public_metrics: tweet.public_metrics || {}
    };

    return res.json({ data: post, meta: apiRes.meta || {} });
  } catch (err) {
    const status = err.status || 500;
    const message = mapErrorStatus(status);
    const details = err.data || err.message;
    console.error('lookup error', err);
    return res.status(status).json({ error: message, details });
  }
});

app.post('/api/trends', async (req, res) => {
  const { woeid } = req.body || {};
  if (!woeid) {
    return res.status(400).json({ error: 'woeid is required' });
  }

  try {
    const client = await getClient();
    const apiRes = await client.trends.getByWoeid(String(woeid));
    const trends = Array.isArray(apiRes.data) ? apiRes.data : [];

    const items = trends.map((t) => ({
      name: t.name || t.trend_name || '',
      query: t.query,
      url: t.url,
      tweet_volume: t.tweet_volume ?? t.tweet_count
    }));

    return res.json({ data: items, meta: apiRes.meta || {} });
  } catch (err) {
    const status = err.status || 500;
    const message = mapErrorStatus(status);
    const details = err.data || err.message;
    console.error('trends error', err);
    return res.status(status).json({ error: message, details });
  }
});

app.post('/api/search/royal-commission', async (req, res) => {
  try {
    const client = await getClient();
    const { query = 'Royal Commission -is:retweet', limit = 10 } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'query is required' });
    }
    const maxResults = Math.min(Math.max(Number(limit) || 10, 10), 100);
    const apiRes = await client.posts.searchRecent(query, {
      maxResults,
      tweetFields: ['author_id', 'created_at', 'public_metrics'],
      userFields: ['username', 'name'],
      expansions: ['author_id']
    });

    const users = new Map((apiRes.includes?.users || []).map((u) => [u.id, u]));
    const posts = (apiRes.data || []).slice(0, maxResults).map((p) => {
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
    console.error('royal-commission search error', err);
    return res.status(status).json({ error: message, details });
  }
});

app.listen(port, () => {
  console.log(`search-recent UI running at http://localhost:${port}`);
});
