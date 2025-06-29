import mockFilters from '@/services/mockData/filters.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.filters = this.loadFilters();
  }

  loadFilters() {
    try {
      const stored = localStorage.getItem('feedflow_filters');
      return stored ? JSON.parse(stored) : [...mockFilters];
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return [...mockFilters];
    }
  }

  saveFilters() {
    try {
      localStorage.setItem('feedflow_filters', JSON.stringify(this.filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }

  async getAll() {
    await delay(250);
    return [...this.filters];
  }

  async getById(id) {
    await delay(200);
    const filter = this.filters.find(f => f.Id === id);
    if (!filter) {
      throw new Error('Filter not found');
    }
    return { ...filter };
  }

  async create(filterData) {
    await delay(300);
    
    const newFilter = {
      Id: Math.max(...this.filters.map(f => f.Id), 0) + 1,
      keyword: filterData.keyword.trim(),
      isActive: filterData.isActive,
      blockedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.filters.unshift(newFilter);
    this.saveFilters();
    return { ...newFilter };
  }

  async update(id, updateData) {
    await delay(250);
    
    const index = this.filters.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Filter not found');
    }

    this.filters[index] = {
      ...this.filters[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveFilters();
    return { ...this.filters[index] };
  }

  async delete(id) {
    await delay(200);
    
    const index = this.filters.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error('Filter not found');
    }

    this.filters.splice(index, 1);
    this.saveFilters();
    return true;
  }

  async testFilter(keyword, testText) {
    await delay(300);
    
    const matches = testText.toLowerCase().includes(keyword.toLowerCase());
    return {
      matches,
      keyword,
      testText: testText.substring(0, 100) + '...'
    };
  }

  async getFilterStats() {
    await delay(200);
    
    const totalBlocked = this.filters.reduce((sum, f) => sum + (f.blockedCount || 0), 0);
    const activeFilters = this.filters.filter(f => f.isActive).length;
    
    return {
      totalFilters: this.filters.length,
      activeFilters,
      totalBlocked,
      averageBlocked: Math.round(totalBlocked / Math.max(1, this.filters.length))
    };
  }
}

export const filterService = new FilterService();