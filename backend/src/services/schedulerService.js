import cron from 'node-cron';
import { RSSFeed } from '../models/RSSFeed.js';
import { updateFeedArticles } from './rssService.js';

let feedUpdateJob = null;

export function startFeedUpdateScheduler() {
  // Run every hour (or as configured)
  const interval = process.env.RSS_UPDATE_INTERVAL || '3600000'; // milliseconds
  const cronExpression = '0 * * * *'; // Every hour

  feedUpdateJob = cron.schedule(cronExpression, async () => {
    console.log('🔄 Starting RSS feed update job...');
    try {
      const staleFeeds = await RSSFeed.getStaleFeeds();
      console.log(`Found ${staleFeeds.length} feeds to update`);

      for (const feed of staleFeeds) {
        try {
          const result = await updateFeedArticles(feed.id);
          console.log(`✅ Updated feed ${feed.id}: ${result.articlesAdded} articles`);
        } catch (error) {
          console.error(`❌ Error updating feed ${feed.id}:`, error.message);
        }
      }

      console.log('✅ RSS feed update job completed');
    } catch (error) {
      console.error('❌ Error in feed update scheduler:', error);
    }
  });

  console.log('📅 RSS feed update scheduler started (every hour)');
}

export function stopFeedUpdateScheduler() {
  if (feedUpdateJob) {
    feedUpdateJob.stop();
    console.log('📅 RSS feed update scheduler stopped');
  }
}
