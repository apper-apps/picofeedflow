import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import FeedCard from '@/components/molecules/FeedCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { feedService } from '@/services/api/feedService';
import { toast } from 'react-toastify';

const FeedManager = () => {
  const { onSidebarToggle } = useOutletContext();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedService.getAll();
      setFeeds(data);
    } catch (err) {
      setError('Failed to load feeds');
      console.error('Error loading feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.url)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      setFormLoading(true);
      
      if (editingFeed) {
        await feedService.update(editingFeed.Id, formData);
        setFeeds(prev => prev.map(feed => 
          feed.Id === editingFeed.Id ? { ...feed, ...formData } : feed
        ));
        toast.success('Feed updated successfully');
      } else {
        const newFeed = await feedService.create(formData);
        setFeeds(prev => [newFeed, ...prev]);
        toast.success('Feed added successfully');
      }
      
      resetForm();
    } catch (error) {
      toast.error(editingFeed ? 'Failed to update feed' : 'Failed to add feed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (feed) => {
    setEditingFeed(feed);
    setFormData({
      name: feed.name,
      url: feed.url,
      isActive: feed.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (feedId) => {
    try {
      await feedService.delete(feedId);
      setFeeds(prev => prev.filter(feed => feed.Id !== feedId));
    } catch (error) {
      throw error;
    }
  };

  const handleToggleStatus = async (feedId, isActive) => {
    try {
      await feedService.update(feedId, { isActive });
      setFeeds(prev => prev.map(feed => 
        feed.Id === feedId ? { ...feed, isActive } : feed
      ));
    } catch (error) {
      throw error;
    }
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', isActive: true });
    setEditingFeed(null);
    setShowAddForm(false);
  };

  const headerActions = [
    {
      label: 'Add Feed',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => setShowAddForm(true)
    }
  ];

  if (loading && feeds.length === 0) {
    return (
      <div className="min-h-screen">
        <Header
          title="Feed Manager"
          subtitle="Manage RSS feed sources"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Loading type="feeds" />
        </div>
      </div>
    );
  }

  if (error && feeds.length === 0) {
    return (
      <div className="min-h-screen">
        <Header
          title="Feed Manager"
          subtitle="Manage RSS feed sources"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadFeeds} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Feed Manager"
        subtitle="Manage RSS feed sources and monitor their health"
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {/* Add/Edit Feed Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6" gradient={true}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingFeed ? 'Edit Feed' : 'Add New Feed'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={resetForm}
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Feed Name"
                      placeholder="e.g., TechCrunch, BBC News..."
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      icon="Tag"
                    />
                    
                    <Input
                      label="RSS Feed URL"
                      placeholder="https://example.com/rss"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      required
                      icon="Link"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Activate feed immediately
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <ApperIcon name="Info" size={16} className="inline mr-1" />
                      Feeds are checked every 10 minutes for new articles
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={formLoading}
                        icon={editingFeed ? "Save" : "Plus"}
                      >
                        {editingFeed ? 'Update Feed' : 'Add Feed'}
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feeds Grid */}
        {feeds.length === 0 ? (
          <Empty
            icon="Rss"
            title="No RSS feeds configured"
            description="Add your first RSS feed to start curating news articles automatically."
            action={
              <Button onClick={() => setShowAddForm(true)} icon="Plus">
                Add Your First Feed
              </Button>
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {feeds.map((feed) => (
                <motion.div
                  key={feed.Id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <FeedCard
                    feed={feed}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Feed Statistics */}
        {feeds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6" gradient={true}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feed Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {feeds.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Feeds</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {feeds.filter(f => f.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Feeds</div>
                </div>
                
                <div className="text-center p-4 bg-accent-50 rounded-lg">
                  <div className="text-2xl font-bold text-accent-600">
                    {feeds.reduce((sum, f) => sum + (f.articleCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Articles</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {feeds.filter(f => f.errorCount > 5).length}
                  </div>
                  <div className="text-sm text-gray-600">Failed Feeds</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedManager;