import axios from 'axios';
import feedparser from 'feedparser';
import { Article } from '../models/Article.js';
import { RSSFeed } from '../models/RSSFeed.js';

export async function fetchRSSFeed(feedUrl) {
  try {
    const response = await axios.get(feedUrl, {
      timeout: parseInt(process.env.RSS_TIMEOUT || '10000'),
    });

    return new Promise((resolve, reject) => {
      const parser = new feedparser();
      const articles = [];

      parser.on('readable', function () {
        let item;
        while ((item = parser.read())) {
          articles.push({
            title: item.title || 'Untitled',
            description: item.description || item.summary || '',
            content: item.content || '',
            author: item.author || 'Unknown',
            image_url: item.image?.url || item.enclosures?.[0]?.url || null,
            source_url: item.link || feedUrl,
            published_at: new Date(item.pubDate || Date.now()),
          });
        }
      });

      parser.on('error', reject);
      parser.on('end', () => resolve(articles));

      parser.write(response.data);
      parser.end();
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error.message);
    throw error;
  }
}

export async function updateFeedArticles(feedId) {
  try {
    const feed = await RSSFeed.getById(feedId);
    if (!feed) {
      throw new Error(`Feed ${feedId} not found`);
    }

    const articles = await fetchRSSFeed(feed.url);
    const maxArticles = parseInt(process.env.RSS_MAX_ARTICLES || '50');
    const articlesToSave = articles.slice(0, maxArticles);

    for (const article of articlesToSave) {
      await Article.create({
        feed_id: feedId,
        ...article,
      });
    }

    await RSSFeed.updateLastFetched(feedId);
    
    return {
      success: true,
      feedId,
      articlesAdded: articlesToSave.length,
    };
  } catch (error) {
    console.error(`Error updating feed ${feedId}:`, error);
    throw error;
  }
}
