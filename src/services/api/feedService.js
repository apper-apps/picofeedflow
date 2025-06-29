import mockFeeds from '@/services/mockData/feeds.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FeedService {
  constructor() {
    this.feeds = this.loadFeeds();
  }

  loadFeeds() {
    try {
      const stored = localStorage.getItem('feedflow_feeds');
      return stored ? JSON.parse(stored) : [...mockFeeds];
    } catch (error) {
      console.error('Error loading feeds from localStorage:', error);
      return [...mockFeeds];
    }
  }

  saveFeeds() {
    try {
      localStorage.setItem('feedflow_feeds', JSON.stringify(this.feeds));
    } catch (error) {
      console.error('Error saving feeds to localStorage:', error);
    }
  }

  async getAll() {
    await delay(300);
    return [...this.feeds];
  }

  async getById(id) {
    await delay(200);
    const feed = this.feeds.find(f => f.Id === id);
    if (!feed) {
      throw new Error('Feed not found');
    }
    return { ...feed };
  }

  async create(feedData) {
    await delay(400);
    
    const newFeed = {
      Id: Math.max(...this.feeds.map(f => f.Id), 0) + 1,
      name: feedData.name,
      url: feedData.url,
      isActive: feedData.isActive,
      lastFetched: null,
      errorCount: 0,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.feeds.unshift(newFeed);
    this.saveFeeds();
    return { ...newFeed };
  }

  async update(id, updateData) {
    await delay(350);
    
    const index = this.feeds.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Feed not found');
    }

    this.feeds[index] = {
      ...this.feeds[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveFeeds();
    return { ...this.feeds[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.feeds.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Feed not found');
    }

    this.feeds.splice(index, 1);
    this.saveFeeds();
    return true;
  }

  async testFeed(url) {
    await delay(500);
    
    // Simulate feed validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      throw new Error('Invalid URL format');
    }

    // Mock response
    return {
      valid: true,
      title: 'Sample Feed',
      articleCount: Math.floor(Math.random() * 100) + 1,
      lastUpdated: new Date().toISOString()
    };
  }

  async fetchFeed(id) {
    await delay(800);
    
    const feed = this.feeds.find(f => f.Id === id);
    if (!feed) {
      throw new Error('Feed not found');
    }

    // Simulate feed fetching
    const newArticleCount = Math.floor(Math.random() * 5);
    
    feed.lastFetched = new Date().toISOString();
    feed.articleCount = (feed.articleCount || 0) + newArticleCount;
    feed.errorCount = Math.random() > 0.8 ? feed.errorCount + 1 : Math.max(0, feed.errorCount - 1);
    
    this.saveFeeds();
    return {
      success: true,
      newArticles: newArticleCount,
      totalArticles: feed.articleCount
    };
  }
}

export const feedService = new FeedService();