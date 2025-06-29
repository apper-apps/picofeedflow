import mockTopics from '@/services/mockData/topics.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TopicService {
  constructor() {
    this.topics = this.loadTopics();
  }

  loadTopics() {
    try {
      const stored = localStorage.getItem('feedflow_topics');
      return stored ? JSON.parse(stored) : [...mockTopics];
    } catch (error) {
      console.error('Error loading topics from localStorage:', error);
      return [...mockTopics];
    }
  }

  saveTopics() {
    try {
      localStorage.setItem('feedflow_topics', JSON.stringify(this.topics));
    } catch (error) {
      console.error('Error saving topics to localStorage:', error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.topics];
  }

  async getById(id) {
    await delay(150);
    const topic = this.topics.find(t => t.Id === id);
    if (!topic) {
      throw new Error('Topic not found');
    }
    return { ...topic };
  }

  async create(topicData) {
    await delay(300);
    
    const newTopic = {
      Id: Math.max(...this.topics.map(t => t.Id), 0) + 1,
      name: topicData.name,
      slug: topicData.slug || topicData.name.toLowerCase().replace(/\s+/g, '-'),
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.topics.push(newTopic);
    this.saveTopics();
    return { ...newTopic };
  }

  async update(id, updateData) {
    await delay(250);
    
    const index = this.topics.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Topic not found');
    }

    this.topics[index] = {
      ...this.topics[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveTopics();
    return { ...this.topics[index] };
  }

  async delete(id) {
    await delay(200);
    
    const index = this.topics.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Topic not found');
    }

    this.topics.splice(index, 1);
    this.saveTopics();
    return true;
  }

  async getPopularTopics(limit = 10) {
    await delay(250);
    
    return this.topics
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, limit);
  }

  async updateArticleCount(topicName, increment = 1) {
    await delay(100);
    
    const topic = this.topics.find(t => t.name === topicName);
    if (topic) {
      topic.articleCount = Math.max(0, topic.articleCount + increment);
      this.saveTopics();
      return topic;
    }
    
    return null;
  }
}

export const topicService = new TopicService();