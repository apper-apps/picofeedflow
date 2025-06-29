import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { feedService } from '@/services/api/feedService';
import { articleService } from '@/services/api/articleService';
import { filterService } from '@/services/api/filterService';

const AnalyticsPage = () => {
  const { onSidebarToggle } = useOutletContext();
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [feeds, articles, filters] = await Promise.all([
        feedService.getAll(),
        articleService.getAll(),
        filterService.getAll()
      ]);

      const now = new Date();
      const timeRangeMs = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };
      
      const cutoffTime = new Date(now.getTime() - timeRangeMs[timeRange]);
      const recentArticles = articles.filter(a => new Date(a.publishDate) >= cutoffTime);

      // Calculate analytics
      const topFeeds = feeds.map(feed => ({
        ...feed,
        recentArticles: articles.filter(a => a.feedId === feed.Id && new Date(a.publishDate) >= cutoffTime).length
      })).sort((a, b) => b.recentArticles - a.recentArticles).slice(0, 5);

      const topTopics = {};
      recentArticles.forEach(article => {
        if (article.topics) {
          article.topics.forEach(topic => {
            topTopics[topic] = (topTopics[topic] || 0) + 1;
          });
        }
      });

      const topTopicsArray = Object.entries(topTopics)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const filterStats = filters.map(filter => ({
        ...filter,
        recentBlocked: Math.floor(Math.random() * 50) // Mock data
      })).sort((a, b) => b.recentBlocked - a.recentBlocked);

      const processedByDay = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        processedByDay[dateStr] = articles.filter(a => 
          new Date(a.publishDate).toISOString().split('T')[0] === dateStr
        ).length;
      }

      setAnalytics({
        summary: {
          totalArticles: recentArticles.length,
          summarizedArticles: recentArticles.filter(a => a.isSummarized).length,
          activeFeeds: feeds.filter(f => f.isActive).length,
          failedFeeds: feeds.filter(f => f.errorCount > 5).length,
          totalFilters: filters.length,
          articlesBlocked: filters.reduce((sum, f) => sum + (f.blockedCount || 0), 0),
          averageProcessingTime: '2.5 minutes',
          systemHealth: feeds.filter(f => f.errorCount < 3).length / feeds.length * 100
        },
        topFeeds,
        topTopics: topTopicsArray,
        filterStats,
        processedByDay: Object.entries(processedByDay).map(([date, count]) => ({ date, count }))
      });
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num) => {
    return `${Math.round(num)}%`;
  };

  const headerActions = [
    {
      label: 'Export Report',
      icon: 'Download',
      variant: 'secondary',
      onClick: () => {
        // Mock export functionality
        const data = JSON.stringify(analytics, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedflow-analytics-${timeRange}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Analytics Dashboard"
          subtitle="System performance and content insights"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Analytics Dashboard"
          subtitle="System performance and content insights"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadAnalytics} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Analytics Dashboard"
        subtitle="System performance and content insights"
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4" gradient={true}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Time Range</h2>
              <div className="flex space-x-2">
                {[
                  { value: '24h', label: '24 Hours' },
                  { value: '7d', label: '7 Days' },
                  { value: '30d', label: '30 Days' },
                  { value: '90d', label: '90 Days' }
                ].map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Articles Processed',
              value: formatNumber(analytics.summary?.totalArticles || 0),
              change: '+12%',
              icon: 'FileText',
              color: 'primary'
            },
            {
              title: 'Summarized Articles',
              value: formatNumber(analytics.summary?.summarizedArticles || 0),
              change: '+8%',
              icon: 'Sparkles',
              color: 'success'
            },
            {
              title: 'Active Feeds',
              value: formatNumber(analytics.summary?.activeFeeds || 0),
              change: '+2',
              icon: 'Rss',
              color: 'accent'
            },
            {
              title: 'System Health',
              value: formatPercentage(analytics.summary?.systemHealth || 0),
              change: '+5%',
              icon: 'Activity',
              color: 'secondary'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card gradient={true} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                    <ApperIcon name={stat.icon} size={24} className="text-white" />
                  </div>
                  <Badge variant="success" size="sm">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gradient mt-1">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Feeds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6" gradient={true}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Feeds</h2>
                <ApperIcon name="TrendingUp" size={18} className="text-primary-600" />
              </div>
              <div className="space-y-4">
                {analytics.topFeeds?.slice(0, 5).map((feed, index) => (
                  <div key={feed.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-48">
                          {feed.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {feed.recentArticles} articles
                        </p>
                      </div>
                    </div>
                    <Badge variant={feed.isActive ? 'success' : 'default'}>
                      {feed.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
                {(!analytics.topFeeds || analytics.topFeeds.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No feed data available</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Popular Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6" gradient={true}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Popular Topics</h2>
                <ApperIcon name="Hash" size={18} className="text-secondary-600" />
              </div>
              <div className="space-y-3">
                {analytics.topTopics?.slice(0, 8).map((topic, index) => {
                  const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'info'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={topic.topic} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={color} size="sm">
                          {topic.topic}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">
                          {topic.count}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r from-${color}-400 to-${color}-500 h-2 rounded-full`}
                            style={{
                              width: `${Math.min(100, (topic.count / (analytics.topTopics?.[0]?.count || 1)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(!analytics.topTopics || analytics.topTopics.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No topic data available</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filter Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter Performance</h2>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Filter" size={18} className="text-red-600" />
                <span className="text-sm text-gray-600">
                  {formatNumber(analytics.summary?.articlesBlocked || 0)} articles blocked
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.filterStats?.slice(0, 6).map((filter) => (
                <div key={filter.Id} className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{filter.keyword}</h3>
                    <Badge variant={filter.isActive ? 'error' : 'default'} size="sm">
                      {filter.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Blocked {filter.recentBlocked} articles in {timeRange}
                  </div>
                </div>
              ))}
              {(!analytics.filterStats || analytics.filterStats.length === 0) && (
                <div className="col-span-full text-gray-500 text-center py-4">
                  No filter data available
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              <Badge variant="success">
                <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                Operational
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Activity" size={24} className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(analytics.summary?.systemHealth || 0)}
                </div>
                <div className="text-sm text-gray-600">System Health</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Clock" size={24} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.summary?.averageProcessingTime || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Avg Processing Time</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Zap" size={24} className="text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPercentage((analytics.summary?.summarizedArticles || 0) / Math.max(1, analytics.summary?.totalArticles || 1) * 100)}
                </div>
                <div className="text-sm text-gray-600">Summarization Rate</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;