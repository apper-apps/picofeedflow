import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { topicService } from '@/services/api/topicService';

const TopicSelector = ({ 
  selectedTopics = [], 
  onTopicChange, 
  maxSelection = null,
  showCounts = true,
  className = '' 
}) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await topicService.getAll();
      setTopics(data);
    } catch (err) {
      setError('Failed to load topics');
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topicId) => {
    let newSelectedTopics;
    
    if (selectedTopics.includes(topicId)) {
      newSelectedTopics = selectedTopics.filter(id => id !== topicId);
    } else {
      if (maxSelection && selectedTopics.length >= maxSelection) {
        return; // Don't add if max selection reached
      }
      newSelectedTopics = [...selectedTopics, topicId];
    }
    
    if (onTopicChange) {
      onTopicChange(newSelectedTopics);
    }
  };

  const clearAllTopics = () => {
    if (onTopicChange) {
      onTopicChange([]);
    }
  };

  const displayTopics = isExpanded ? topics : topics.slice(0, 8);

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Topics</h3>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-20 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
        <Button variant="ghost" size="sm" onClick={loadTopics} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Topics {maxSelection && `(${selectedTopics.length}/${maxSelection})`}
        </h3>
        {selectedTopics.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTopics}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {displayTopics.map((topic) => {
            const isSelected = selectedTopics.includes(topic.Id);
            const isDisabled = !isSelected && maxSelection && selectedTopics.length >= maxSelection;
            
            return (
              <motion.button
                key={topic.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => handleTopicToggle(topic.Id)}
                disabled={isDisabled}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {topic.name}
                {showCounts && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    isSelected ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {topic.articleCount}
                  </span>
                )}
                {isSelected && (
                  <ApperIcon name="Check" size={14} className="ml-1" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {topics.length > 8 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? "ChevronUp" : "ChevronDown"}
          className="text-sm"
        >
          {isExpanded ? 'Show Less' : `Show ${topics.length - 8} More`}
        </Button>
      )}
    </div>
  );
};

export default TopicSelector;