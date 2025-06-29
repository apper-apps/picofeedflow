import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import { feedService } from '@/services/api/feedService';
import { articleService } from '@/services/api/articleService';
import { filterService } from '@/services/api/filterService';

const AdminDashboard = () => {
  const { onSidebarToggle } = useOutletContext();
  const [stats, setStats] = useState({});
  const [recentFeeds, setRecentFeeds] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, feedsData, articlesData] = await Promise.all([
        getSystemStats(),
        feedService.getAll(),
        articleService.getAll({ limit: 5 })
      ]);
      
      setStats(statsData);
      setRecentFeeds(feedsData.slice(0, 5));
      setRecentArticles(articlesData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSystemStats = async () => {
    try {
      const [feeds, articles, filters] = await Promise.all([
        feedService.getAll(),
        articleService.getAll(),
        filterService.getAll()
      ]);

      const activeFeeds = feeds.filter(f => f.isActive).length;
      const totalArticles = articles.length;
      const todayArticles = articles.filter(a => {
        const today = new Date().toDateString();
        return new Date(a.publishDate).toDateString() === today;
      }).length;
      const failedFeeds = feeds.filter(f => f.errorCount > 5).length;

      return {
        totalFeeds: feeds.length,
        activeFeeds,
        totalArticles,
        todayArticles,
        totalFilters: filters.length,
        failedFeeds,
        processingRate: totalArticles > 0 ? Math.round((todayArticles / totalArticles) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return {};
    }
  };

  const headerActions = [
    {
      label: 'Add Feed',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => window.location.href = '/feeds'
    },
    {
      label: 'Manage Filters',
      icon: 'Filter',
      variant: 'secondary',
      onClick: () => window.location.href = '/filters'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Admin Dashboard"
          subtitle="System overview and management"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Admin Dashboard"
        subtitle="System overview and content management"
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card gradient={true} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Feeds</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.activeFeeds}/{stats.totalFeeds}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Rss" size={24} className="text-white" />
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
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.totalArticles?.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="FileText" size={24} className="text-white" />
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
                  <p className="text-sm font-medium text-gray-600">Today's Articles</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.todayArticles}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Calendar" size={24} className="text-white" />
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
                  <p className="text-sm font-medium text-gray-600">Active Filters</p>
                  <p className="text-3xl font-bold text-gradient mt-1">
                    {stats.totalFilters}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Filter" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6" gradient={true}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.activeFeeds}</div>
                <div className="text-sm text-gray-600">Healthy Feeds</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="AlertTriangle" size={24} className="text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{stats.failedFeeds}</div>
                <div className="text-sm text-gray-600">Failed Feeds</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Activity" size={24} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.processingRate}%</div>
                <div className="text-sm text-gray-600">Processing Rate</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Feeds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6" gradient={true}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Feeds</h2>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/feeds'}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentFeeds.map((feed) => (
                  <div key={feed.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Rss" size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-48">{feed.name}</p>
                        <p className="text-sm text-gray-600">{feed.articleCount || 0} articles</p>
                      </div>
                    </div>
                    <Badge variant={feed.isActive ? 'success' : 'default'}>
                      {feed.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
                {recentFeeds.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No feeds configured yet</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6" gradient={true}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.Id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="FileText" size={18} className="text-secondary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2 text-sm">{article.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={article.isSummarized ? 'success' : 'warning'} size="sm">
                          {article.isSummarized ? 'Summarized' : 'Processing'}
                        </Badge>
                        {article.topics && article.topics.length > 0 && (
                          <Badge variant="secondary" size="sm">
                            {article.topics[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {recentArticles.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No articles processed yet</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;