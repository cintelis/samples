/**
 * Recent Search - X API v2
 * 
 * Endpoint: GET https://api.x.com/2/posts/search/recent
 * Docs: https://developer.x.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
 * 
 * Authentication: Bearer Token (App-only)
 * Required env vars: BEARER_TOKEN
 * 
 * Note: Returns posts from the last 7 days.
 * This example demonstrates automatic pagination using PostPaginator
 * to fetch all pages of results.
 */

const { Client, PostPaginator } = require('@xdevplatform/xdk');

const bearerToken = process.env.BEARER_TOKEN;
const client = new Client({ bearerToken: bearerToken });

const query = 'from:TruthTrumpPost -is:retweet';
const limit = 5;
const maxResults = Math.max(limit, 10); // API requires min 10

const searchRecent = async () => {
    console.log(`Searching recent posts (max ${limit})...`);
    
    // Use paginator for automatic pagination (we'll stop after we hit our limit)
    const searchResults = new PostPaginator(
        async (token) => {
            const res = await client.posts.searchRecent(query, {
                maxResults: maxResults,
                nextToken: token,
                tweetFields: ['author_id', 'created_at']
            });
            return {
                data: res.data ?? [],
                meta: res.meta,
                includes: res.includes,
                errors: res.errors
            };
        }
    );

    // Fetch until we reach the limit or there are no more pages
    await searchResults.fetchNext();
    while (!searchResults.done && searchResults.posts.length < limit) {
        await searchResults.fetchNext();
    }

    const posts = searchResults.posts.slice(0, limit);

    console.dir(posts, {
        depth: null
    });

    console.log(`Got ${posts.length} posts for query: ${query}`);
}

searchRecent().catch(err => {
    console.error('Error:', err);
    process.exit(-1);
});
