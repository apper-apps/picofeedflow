import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '@/components/molecules/ArticleCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import { articleService } from '@/services/api/articleService';

const ArticleGrid = ({ 
  filters = {}, 
  searchQuery = '',
  selectedTopics = [],
  sortBy = 'publishDate',
  viewMode = 'grid',
  onBookmarkToggle
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadArticles(true);
  }, [filters, searchQuery, selectedTopics, sortBy]);

  const loadArticles = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 12,
        search: searchQuery,
        topics: selectedTopics,
        sortBy,
        ...filters
      };
      
      const data = await articleService.getAll(params);
      
      if (reset) {
        setArticles(data);
        setPage(2);
      } else {
        setArticles(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.length === 12);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (articleId, isBookmarked) => {
    try {
      await articleService.toggleBookmark(articleId, isBookmarked);
      
      // Update local state
      setArticles(prev => 
        prev.map(article => 
          article.Id === articleId 
            ? { ...article, isBookmarked }
            : article
        )
      );
      
      if (onBookmarkToggle) {
        onBookmarkToggle(articleId, isBookmarked);
      }
    } catch (error) {
      throw error; // Let the card handle the error
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    }
  };

  if (loading && articles.length === 0) {
    return <Loading />;
  }

  if (error && articles.length === 0) {
    return <Error message={error} onRetry={() => loadArticles(true)} />;
  }

  if (articles.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No articles found"
        description="We couldn't find any articles matching your criteria. Try adjusting your filters or search terms."
        action={
          <Button onClick={() => loadArticles(true)}>
            Refresh Articles
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        <AnimatePresence>
          {articles.map((article) => (
            <motion.div
              key={article.Id}
              variants={itemVariants}
              layout
            >
              <ArticleCard
                article={article}
                compact={viewMode === 'list'}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => loadArticles()}
            loading={loading}
            variant="secondary"
            size="lg"
            icon="ChevronDown"
          >
            Load More Articles
          </Button>
        </div>
      )}

      {loading && articles.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
            <span className="text-sm">Loading more articles...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;