# X API v2 - Python Examples

Working Python examples for the X API v2.

## Setup

```bash
pip install requests requests-oauthlib
```

## Environment Variables

```bash
export BEARER_TOKEN='your_bearer_token'
export CONSUMER_KEY='your_consumer_key'
export CONSUMER_SECRET='your_consumer_secret'
```

## Examples

### Posts
- posts/create_post.py
- posts/delete_post.py
- posts/get_liked_posts.py
- posts/get_liking_users.py
- posts/get_post_counts_all.py
- posts/get_post_counts_recent.py
- posts/get_posts_by_ids.py
- posts/get_quoted_posts.py
- posts/like_post.py
- posts/repost_post.py
- posts/retweeted_by.py
- posts/search_all.py
- posts/search_recent.py
- posts/undo_a_retweet.py
- posts/unlike_a_tweet.py

### Users
- users/following_lookup.py
- users/get_followers.py
- users/get_users_me_user_context.py
- users/get_users_with_bearer_token.py
- users/get_users_with_user_context.py
- users/lookup_blocks.py
- users/lookup_mutes.py
- users/lookup.py
- users/me.py
- users/mute_a_user.py
- users/muted.py
- users/unblock_a_user.py
- users/unmute_a_user.py

### Timelines
- timelines/get_mentions.py
- timelines/get_posts.py
- timelines/get_timeline.py
- timelines/reverse-chron-home-timeline.py

### Streams
- streams/filtered_stream.py
- streams/sampled_stream.py

### Lists
- lists/add_list_member.py
- lists/create_list.py
- lists/delete_list.py
- lists/follow_list.py
- lists/get_list_by_id.py
- lists/get_list_followers.py
- lists/get_list_members.py
- lists/get_list_posts.py
- lists/pin_list.py
- lists/Pinned-List.py
- lists/remove_member.py
- lists/unfollow_list.py
- lists/unpin_list.py
- lists/update_a_list.py
- lists/user-list-followed.py
- lists/user-list-memberships.py
- lists/user-owned-list-lookup.py

### Bookmarks
- bookmarks/bookmarks_lookup.py
- bookmarks/create_bookmark.py
- bookmarks/delete_bookmark.py

### Spaces
- spaces/search_spaces.py
- spaces/spaces_lookup.py

### Direct Messages
- direct_messages/get_events_by_conversation.py
- direct_messages/get_one_to_one_conversation_events.py
- direct_messages/get_user_conversation_events.py
- direct_messages/post_dm_to_conversation.py
- direct_messages/post_group_conversation_dm.py
- direct_messages/post_one_to_one_dm.py

### Media
- media/media_upload_v2.py
- media/upload.py

### Compliance
- compliance/create_compliance_job.py
- compliance/download_compliance_results.py
- compliance/get_compliance_job_information_by_id.py
- compliance/get_jobs.py
- compliance/get_list_of_compliance_jobs.py
- compliance/upload_ids.py

### Usage
- usage/get_usage.py

