import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { articleService } from '@/services/api/articleService';
import { toast } from 'react-toastify';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onSidebarToggle } = useOutletContext();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle();
      loadRelatedArticles();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getById(parseInt(id));
      setArticle(data);
      
      // Mark as read
      await articleService.markAsRead(parseInt(id));
    } catch (err) {
      setError('Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async () => {
    try {
      const data = await articleService.getRelated(parseInt(id));
      setRelatedArticles(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading related articles:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      setBookmarkLoading(true);
      const newBookmarkState = !article.isBookmarked;
      
      await articleService.toggleBookmark(article.Id, newBookmarkState);
      setArticle(prev => ({ ...prev, isBookmarked: newBookmarkState }));
      
      toast.success(
        newBookmarkState ? 'Article bookmarked!' : 'Bookmark removed',
        { autoClose: 2000 }
      );
    } catch (error) {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
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

  const headerActions = [
    {
      label: 'Back',
      icon: 'ArrowLeft',
      variant: 'secondary',
      onClick: () => navigate(-1)
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Loading Article..."
          onSidebarToggle={onSidebarToggle}
          actions={headerActions}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Header
          title="Article Not Found"
          onSidebarToggle={onSidebarToggle}
          actions={headerActions}
        />
        <div className="p-6">
          <Error 
            message={error || 'Article not found'} 
            onRetry={loadArticle}
            showHome={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Article View"
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8" gradient={true}>
            {/* Meta Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {article.source && (
                  <div className="flex items-center">
                    <ApperIcon name="Globe" size={16} className="mr-1" />
                    {article.source}
                  </div>
                )}
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={16} className="mr-1" />
                  {format(new Date(article.publishDate), 'MMMM d, yyyy')}
                </div>
                {article.readTime && (
                  <div className="flex items-center">
                    <ApperIcon name="Clock" size={16} className="mr-1" />
                    {article.readTime} min read
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {article.isSummarized ? (
                  <Badge variant="success">
                    <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                    Summarized
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <ApperIcon name="Clock" size={14} className="mr-1" />
                    Processing
                  </Badge>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Topics */}
            {article.topics && article.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.topics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant={getTopicColor(topic)}
                    size="md"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Button
                  variant={article.isBookmarked ? "primary" : "secondary"}
                  icon={article.isBookmarked ? "Bookmark" : "BookmarkPlus"}
                  onClick={handleBookmarkToggle}
                  loading={bookmarkLoading}
                >
                  {article.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                
                <Button
                  variant="secondary"
                  icon="Share2"
                  onClick={handleShare}
                >
                  Share
                </Button>
                
                {article.url && (
                  <Button
                    variant="secondary"
                    icon="ExternalLink"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    Original
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8" gradient={true}>
            {article.isSummarized && article.summary ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="Sparkles" size={20} className="mr-2 text-primary-600" />
                    AI Summary
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>
                
                {article.keyPoints && article.keyPoints.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <ApperIcon name="List" size={18} className="mr-2" />
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {article.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start text-blue-800">
                          <ApperIcon name="ChevronRight" size={16} className="mr-2 mt-0.5 text-blue-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Clock" size={24} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Summary in Progress
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our AI is currently processing this article to create a concise summary. 
                  Please check back in a few minutes.
                </p>
                <Button
                  variant="secondary"
                  icon="RefreshCw"
                  onClick={loadArticle}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6" gradient={true}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Link" size={20} className="mr-2 text-secondary-600" />
                Related Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <motion.div
                    key={relatedArticle.Id}
                    whileHover={{ y: -2 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/article/${relatedArticle.Id}`)}
                  >
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedArticle.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {format(new Date(relatedArticle.publishDate), 'MMM d')}
                      </span>
                      {relatedArticle.topics && relatedArticle.topics[0] && (
                        <Badge variant={getTopicColor(relatedArticle.topics[0])} size="sm">
                          {relatedArticle.topics[0]}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;