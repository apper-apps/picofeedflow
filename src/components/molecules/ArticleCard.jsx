import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const ArticleCard = ({ 
  article, 
  showBookmark = true,
  showSource = true,
  compact = false,
  onBookmarkToggle
}) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on bookmark button
    if (e.target.closest('[data-bookmark-button]')) {
      return;
    }
    navigate(`/article/${article.Id}`);
  };

  const handleBookmarkToggle = async (e) => {
    e.stopPropagation();
    
    try {
      setBookmarkLoading(true);
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      
      if (onBookmarkToggle) {
        await onBookmarkToggle(article.Id, newBookmarkState);
      }
      
      toast.success(
        newBookmarkState ? 'Article bookmarked!' : 'Bookmark removed',
        { autoClose: 2000 }
      );
    } catch (error) {
      // Revert state on error
      setIsBookmarked(!isBookmarked);
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      'Technology': 'primary',
      'Business': 'secondary',
      'Health': 'success',
      'Sports': 'accent',
      'Politics': 'info',
      'Science': 'warning'
    };
    return colors[topic] || 'default';
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`p-6 hover:shadow-xl ${compact ? 'p-4' : ''}`}
      hover={true}
      gradient={true}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {showSource && article.source && (
              <div className="flex items-center mb-2">
                <ApperIcon name="Globe" size={14} className="text-gray-500 mr-1" />
                <span className="text-xs text-gray-500 font-medium">
                  {article.source}
                </span>
              </div>
            )}
            <h3 className={`font-semibold text-gray-900 leading-tight line-clamp-2 ${
              compact ? 'text-sm' : 'text-lg'
            }`}>
              {article.title}
            </h3>
          </div>
          
          {showBookmark && (
            <motion.button
              data-bookmark-button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              className={`ml-3 p-2 rounded-full transition-all duration-200 ${
                isBookmarked 
                  ? 'text-accent-500 bg-accent-50 hover:bg-accent-100' 
                  : 'text-gray-400 hover:text-accent-500 hover:bg-accent-50'
              }`}
            >
              {bookmarkLoading ? (
                <ApperIcon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <ApperIcon 
                  name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                  size={18}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              )}
            </motion.button>
          )}
        </div>

        {/* Summary */}
        {article.summary && (
          <p className={`text-gray-600 mb-4 flex-1 ${
            compact ? 'text-sm line-clamp-2' : 'line-clamp-3'
          }`}>
            {article.summary}
          </p>
        )}

        {/* Topics */}
        {article.topics && article.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.topics.slice(0, compact ? 2 : 3).map((topic, index) => (
              <Badge
                key={index}
                variant={getTopicColor(topic)}
                size="sm"
              >
                {topic}
              </Badge>
            ))}
            {article.topics.length > (compact ? 2 : 3) && (
              <Badge variant="default" size="sm">
                +{article.topics.length - (compact ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Clock" size={14} className="mr-1" />
              {format(new Date(article.publishDate), 'MMM d, yyyy')}
            </div>
            {article.readTime && (
              <div className="flex items-center">
                <ApperIcon name="BookOpen" size={14} className="mr-1" />
                {article.readTime} min read
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {article.isSummarized ? (
              <div className="flex items-center text-green-600">
                <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                <span className="text-xs font-medium">Summarized</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <ApperIcon name="Clock" size={14} className="mr-1" />
                <span className="text-xs font-medium">Processing</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;