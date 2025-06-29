import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import ArticleGrid from '@/components/organisms/ArticleGrid';
import TopicSelector from '@/components/molecules/TopicSelector';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { articleService } from '@/services/api/articleService';

const UserDashboard = () => {
  const { onSidebarToggle } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('publishDate');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalArticles: 0,
    todayArticles: 0,
    bookmarkedArticles: 0,
    readArticles: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await articleService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const headerActions = [
    {
      label: viewMode === 'grid' ? 'List View' : 'Grid View',
      icon: viewMode === 'grid' ? 'List' : 'Grid3x3',
      variant: 'secondary',
      onClick: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid')
    }
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="News Dashboard"
        subtitle="Discover personalized news articles curated just for you"
        showSearch={true}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card gradient={true} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.totalArticles.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="FileText" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card gradient={true} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Articles</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.todayArticles}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Calendar" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card gradient={true} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.bookmarkedArticles}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Bookmark" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card gradient={true} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Read Articles</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.readArticles}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Personalize Your Feed</h2>
              <Button
                variant="ghost"
                size="sm"
                icon={showFilters ? "ChevronUp" : "ChevronDown"}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {/* Topic Selector */}
                <TopicSelector
                  selectedTopics={selectedTopics}
                  onTopicChange={setSelectedTopics}
                  showCounts={true}
                />

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'publishDate', label: 'Latest', icon: 'Clock' },
                      { value: 'popularity', label: 'Popular', icon: 'TrendingUp' },
                      { value: 'relevance', label: 'Relevant', icon: 'Target' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? 'primary' : 'secondary'}
                        size="sm"
                        icon={option.icon}
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedTopics.length > 0 || searchQuery) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge variant="primary">
                          Search: "{searchQuery}"
                        </Badge>
                      )}
                      {selectedTopics.length > 0 && (
                        <Badge variant="secondary">
                          {selectedTopics.length} Topic{selectedTopics.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTopics([]);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ArticleGrid
            searchQuery={searchQuery}
            selectedTopics={selectedTopics}
            sortBy={sortBy}
            viewMode={viewMode}
            onBookmarkToggle={loadStats} // Refresh stats when bookmarks change
          />
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;