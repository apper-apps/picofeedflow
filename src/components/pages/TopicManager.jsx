import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import TopicSelector from '@/components/molecules/TopicSelector';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { topicService } from '@/services/api/topicService';
import { toast } from 'react-toastify';

const TopicManager = () => {
  const { onSidebarToggle } = useOutletContext();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole] = useState('admin'); // In real app, get from auth context

  useEffect(() => {
    loadTopics();
    loadUserPreferences();
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

  const loadUserPreferences = async () => {
    try {
      // In real app, load from user service
      const savedTopics = localStorage.getItem('selectedTopics');
      if (savedTopics) {
        setSelectedTopics(JSON.parse(savedTopics));
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const handleTopicChange = async (newSelectedTopics) => {
    try {
      setSelectedTopics(newSelectedTopics);
      
      // Save to localStorage (in real app, save to user service)
      localStorage.setItem('selectedTopics', JSON.stringify(newSelectedTopics));
      
      toast.success('Topic preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      'Technology': 'primary',
      'Business': 'secondary',
      'Health': 'success',
      'Sports': 'accent',
      'Politics': 'info',
      'Science': 'warning',
      'Entertainment': 'default'
    };
    return colors[topic] || 'default';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title={userRole === 'admin' ? 'Topic Management' : 'Your Topics'}
          subtitle={userRole === 'admin' ? 'Manage article topics and categories' : 'Customize your news feed by selecting topics'}
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
          title={userRole === 'admin' ? 'Topic Management' : 'Your Topics'}
          subtitle={userRole === 'admin' ? 'Manage article topics and categories' : 'Customize your news feed by selecting topics'}
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadTopics} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={userRole === 'admin' ? 'Topic Management' : 'Your Topics'}
        subtitle={userRole === 'admin' ? 'Manage article topics and categories' : 'Customize your news feed by selecting topics of interest'}
        onSidebarToggle={onSidebarToggle}
      />

      <div className="p-6 space-y-6">
        {/* User Topic Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {userRole === 'admin' ? 'Preview Topic Selection' : 'Select Your Interests'}
              </h2>
              <p className="text-gray-600">
                {userRole === 'admin' 
                  ? 'Preview how users will see and select topics for their personalized feed.'
                  : 'Choose topics you\'re interested in to personalize your news feed. You can select multiple topics.'
                }
              </p>
            </div>

            <TopicSelector
              selectedTopics={selectedTopics}  
              onTopicChange={handleTopicChange}
              showCounts={true}
            />

            {selectedTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-primary-50 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <ApperIcon name="CheckCircle" size={18} className="text-primary-600 mr-2" />
                  <h3 className="font-medium text-primary-900">
                    Your Personalized Feed is Ready
                  </h3>
                </div>
                <p className="text-sm text-primary-700">
                  You'll receive articles from {selectedTopics.length} selected topic{selectedTopics.length > 1 ? 's' : ''}.
                  {userRole !== 'admin' && ' Articles will be filtered and summarized based on your preferences.'}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Topic Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6" gradient={true}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Topic Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {topics.length}
                </div>
                <div className="text-sm text-gray-600">Available Topics</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {topics.reduce((sum, t) => sum + t.articleCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Articles</div>
              </div>
              
              <div className="text-center p-4 bg-accent-50 rounded-lg">
                <div className="text-2xl font-bold text-accent-600">
                  {selectedTopics.length}
                </div>
                <div className="text-sm text-gray-600">Your Selections</div>
              </div>
              
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-600">
                  {topics.filter(t => selectedTopics.includes(t.Id)).reduce((sum, t) => sum + t.articleCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Your Articles</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* All Topics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" gradient={true}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {topics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic.Id);
                  
                  return (
                    <motion.div
                      key={topic.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{topic.name}</h3>
                        {isSelected && (
                          <ApperIcon name="CheckCircle" size={18} className="text-primary-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={getTopicColor(topic.name)} size="sm">
                          {topic.articleCount} articles
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {topic.slug}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6" gradient={true}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                icon="Home"
                onClick={() => window.location.href = '/'}
              >
                View Personalized Feed
              </Button>
              
              <Button
                variant="secondary"
                icon="Bookmark"
                onClick={() => window.location.href = '/bookmarks'}
              >
                View Bookmarks
              </Button>
              
              <Button
                variant="ghost"
                icon="RefreshCw"
                onClick={loadTopics}
              >
                Refresh Topics
              </Button>
              
              {selectedTopics.length > 0 && (
                <Button
                  variant="ghost"
                  icon="X"
                  onClick={() => handleTopicChange([])}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All Selections
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicManager;