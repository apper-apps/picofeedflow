import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ArticleGrid from "@/components/organisms/ArticleGrid";
import ArticleCard from "@/components/molecules/ArticleCard";
import SearchBar from "@/components/molecules/SearchBar";
import TopicSelector from "@/components/molecules/TopicSelector";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { articleService } from "@/services/api/articleService";

const BookmarksPage = () => {
  const { onSidebarToggle } = useOutletContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [sortBy, setSortBy] = useState('bookmarkedAt');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedTopics, sortBy]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error('Error loading bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by topics
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(article =>
        article.topics && article.topics.some(topic => selectedTopics.includes(topic))
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'bookmarkedAt':
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
        case 'publishDate':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredBookmarks(filtered);
  };

  const handleBookmarkToggle = async (articleId, isBookmarked) => {
    try {
      await articleService.toggleBookmark(articleId, isBookmarked);
      
      if (!isBookmarked) {
        // Remove from bookmarks
        setBookmarks(prev => prev.filter(article => article.Id !== articleId));
      }
    } catch (error) {
      throw error;
    }
  };

  const clearAllBookmarks = async () => {
    if (!window.confirm('Are you sure you want to remove all bookmarks?')) {
      return;
    }

    try {
      await Promise.all(bookmarks.map(article => 
        articleService.toggleBookmark(article.Id, false)
      ));
      setBookmarks([]);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Your Bookmarks"
          subtitle="Articles you've saved for later reading"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Your Bookmarks"
          subtitle="Articles you've saved for later reading"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadBookmarks} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Your Bookmarks"
        subtitle={`${bookmarks.length} saved article${bookmarks.length !== 1 ? 's' : ''}`}
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {bookmarks.length === 0 ? (
          <Empty
            icon="Bookmark"
            title="No bookmarks yet"
            description="Articles you bookmark will appear here. Start reading and save your favorite articles for later!"
            action={
              <Button onClick={() => window.location.href = '/'} icon="Home">
                Browse Articles
              </Button>
            }
          />
        ) : (
          <>
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6" gradient={true}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Filter Bookmarks</h2>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={showFilters ? "ChevronUp" : "ChevronDown"}
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? 'Hide' : 'Show'} Filters
                      </Button>
                      {bookmarks.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={clearAllBookmarks}
                          className="text-red-600 hover:text-red-700"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>

                  <SearchBar
                    placeholder="Search your bookmarks..."
                    value={searchQuery}
                    onSearch={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                  />

                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 pt-4 border-t border-gray-200"
                    >
                      {/* Topic Filter */}
                      <TopicSelector
                        selectedTopics={selectedTopics}
                        onTopicChange={setSelectedTopics}
                        showCounts={false}
                      />

                      {/* Sort Options */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'bookmarkedAt', label: 'Recently Bookmarked', icon: 'Bookmark' },
                            { value: 'publishDate', label: 'Publication Date', icon: 'Calendar' },
                            { value: 'title', label: 'Title A-Z', icon: 'ArrowUpAZ' }
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
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Bookmark Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card gradient={true} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookmarks</p>
                      <p className="text-3xl font-bold text-gradient mt-1">
                        {bookmarks.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Bookmark" size={24} className="text-white" />
                    </div>
                  </div>
                </Card>

                <Card gradient={true} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                      <p className="text-3xl font-bold text-gradient mt-1">
                        {filteredBookmarks.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Filter" size={24} className="text-white" />
                    </div>
                  </div>
                </Card>

                <Card gradient={true} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reading Time</p>
                      <p className="text-3xl font-bold text-gradient mt-1">
                        {Math.round(filteredBookmarks.reduce((sum, article) => sum + (article.readTime || 5), 0))}m
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Clock" size={24} className="text-white" />
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Bookmarks Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {filteredBookmarks.length === 0 ? (
                <Empty
                  icon="Search"
                  title="No bookmarks match your filters"
                  description="Try adjusting your search terms or topic filters to find the bookmarks you're looking for."
                  action={
                    <Button onClick={() => {
                      setSearchQuery('');
                      setSelectedTopics([]);
                    }}>
                      Clear Filters
                    </Button>
                  }
                />
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredBookmarks.map((article) => (
                    <div key={article.Id}>
                      <ArticleCard
                        article={article}
                        compact={viewMode === 'list'}
                        onBookmarkToggle={handleBookmarkToggle}
                        showBookmark={true}
                        showSource={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;