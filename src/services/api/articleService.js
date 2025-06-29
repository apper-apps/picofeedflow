import mockArticles from '@/services/mockData/articles.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ArticleService {
  constructor() {
    this.articles = this.loadArticles();
    this.bookmarks = this.loadBookmarks();
    this.readArticles = this.loadReadArticles();
  }

  loadArticles() {
    try {
      const stored = localStorage.getItem('feedflow_articles');
      return stored ? JSON.parse(stored) : [...mockArticles];
    } catch (error) {
      console.error('Error loading articles from localStorage:', error);
      return [...mockArticles];
    }
  }

  loadBookmarks() {
    try {
      const stored = localStorage.getItem('feedflow_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
      return [];
    }
  }

  loadReadArticles() {
    try {
      const stored = localStorage.getItem('feedflow_read_articles');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading read articles from localStorage:', error);
      return [];
    }
  }

  saveArticles() {
    try {
      localStorage.setItem('feedflow_articles', JSON.stringify(this.articles));
    } catch (error) {
      console.error('Error saving articles to localStorage:', error);
    }
  }

  saveBookmarks() {
    try {
      localStorage.setItem('feedflow_bookmarks', JSON.stringify(this.bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }

  saveReadArticles() {
    try {
      localStorage.setItem('feedflow_read_articles', JSON.stringify(this.readArticles));
    } catch (error) {
      console.error('Error saving read articles to localStorage:', error);
    }
  }

  async getAll(params = {}) {
    await delay(350);
    
    let filtered = [...this.articles];

    // Add bookmark status
    filtered = filtered.map(article => ({
      ...article,
      isBookmarked: this.bookmarks.includes(article.Id),
      isRead: this.readArticles.includes(article.Id)
    }));

    // Apply filters
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm))
      );
    }

    if (params.topics && params.topics.length > 0) {
      filtered = filtered.filter(article =>
        article.topics && article.topics.some(topic => params.topics.includes(topic))
      );
    }

    if (params.isSummarized !== undefined) {
      filtered = filtered.filter(article => article.isSummarized === params.isSummarized);
    }

    // Sort articles
    const sortBy = params.sortBy || 'publishDate';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'publishDate':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.readTime || 0) - (a.readTime || 0);
        default:
          return 0;
      }
    });

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const start = (page - 1) * limit;
    const end = start + limit;

    return filtered.slice(start, end);
  }

  async getById(id) {
    await delay(250);
    
    const article = this.articles.find(a => a.Id === id);
    if (!article) {
      throw new Error('Article not found');
    }

    return {
      ...article,
      isBookmarked: this.bookmarks.includes(article.Id),
      isRead: this.readArticles.includes(article.Id)
    };
  }

  async getBookmarks() {
    await delay(300);
    
    const bookmarkedArticles = this.articles
      .filter(article => this.bookmarks.includes(article.Id))
      .map(article => ({
        ...article,
        isBookmarked: true,
        bookmarkedAt: new Date().toISOString() // Mock bookmark date
      }))
      .sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));

    return bookmarkedArticles;
  }

  async getRelated(articleId) {
    await delay(400);
    
    const article = this.articles.find(a => a.Id === articleId);
    if (!article) {
      return [];
    }

    // Find articles with similar topics
    const related = this.articles
      .filter(a => 
        a.Id !== articleId && 
        a.topics && 
        article.topics &&
        a.topics.some(topic => article.topics.includes(topic))
      )
      .slice(0, 5);

    return related.map(a => ({
      ...a,
      isBookmarked: this.bookmarks.includes(a.Id)
    }));
  }

  async toggleBookmark(articleId, isBookmarked) {
    await delay(200);
    
    if (isBookmarked) {
      if (!this.bookmarks.includes(articleId)) {
        this.bookmarks.push(articleId);
      }
    } else {
      const index = this.bookmarks.indexOf(articleId);
      if (index > -1) {
        this.bookmarks.splice(index, 1);
      }
    }

    this.saveBookmarks();
    return true;
  }

  async markAsRead(articleId) {
    await delay(150);
    
    if (!this.readArticles.includes(articleId)) {
      this.readArticles.push(articleId);
      this.saveReadArticles();
    }

    return true;
  }

  async getStats() {
    await delay(200);
    
    const today = new Date().toDateString();
    const todayArticles = this.articles.filter(a => 
      new Date(a.publishDate).toDateString() === today
    ).length;

    return {
      totalArticles: this.articles.length,
      todayArticles,
      bookmarkedArticles: this.bookmarks.length,
      readArticles: this.readArticles.length,
      summarizedArticles: this.articles.filter(a => a.isSummarized).length
    };
  }

  async create(articleData) {
    await delay(400);
    
    const newArticle = {
      Id: Math.max(...this.articles.map(a => a.Id), 0) + 1,
      feedId: articleData.feedId,
      title: articleData.title,
      url: articleData.url,
      summary: articleData.summary || '',
      publishDate: articleData.publishDate || new Date().toISOString(),
      topics: articleData.topics || [],
      isSummarized: articleData.isSummarized || false,
      source: articleData.source || '',
      readTime: articleData.readTime || Math.floor(Math.random() * 10) + 1,
      createdAt: new Date().toISOString()
    };

    this.articles.unshift(newArticle);
    this.saveArticles();
    return { ...newArticle };
  }

  async update(id, updateData) {
    await delay(300);
    
    const index = this.articles.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }

    this.articles[index] = {
      ...this.articles[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveArticles();
    return { ...this.articles[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.articles.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }

    // Remove from bookmarks and read articles as well
    const bookmarkIndex = this.bookmarks.indexOf(id);
    if (bookmarkIndex > -1) {
      this.bookmarks.splice(bookmarkIndex, 1);
      this.saveBookmarks();
    }

    const readIndex = this.readArticles.indexOf(id);
    if (readIndex > -1) {
      this.readArticles.splice(readIndex, 1);
      this.saveReadArticles();
    }

    this.articles.splice(index, 1);
    this.saveArticles();
    return true;
  }
}

export const articleService = new ArticleService();