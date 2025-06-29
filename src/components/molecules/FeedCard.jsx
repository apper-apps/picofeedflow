import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const FeedCard = ({ 
  feed, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showActions = true 
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      await onToggleStatus(feed.Id, !feed.isActive);
      toast.success(`Feed ${feed.isActive ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update feed status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feed?')) {
      try {
        setLoading(true);
        await onDelete(feed.Id);
        toast.success('Feed deleted successfully');
      } catch (error) {
        toast.error('Failed to delete feed');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = () => {
    if (!feed.isActive) return 'default';
    if (feed.errorCount > 5) return 'error';
    if (feed.errorCount > 0) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (!feed.isActive) return 'Disabled';
    if (feed.errorCount > 5) return 'Failed';
    if (feed.errorCount > 0) return 'Warning';
    return 'Active';
  };

  return (
    <Card className="p-6" gradient={true}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2">
            <ApperIcon name="Rss" size={18} className="text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {feed.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 break-all mb-3">
            {feed.url}
          </p>
        </div>
        
        <Badge variant={getStatusColor()}>
          {getStatusText()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{feed.articleCount || 0}</div>
          <div className="text-sm text-gray-600">Articles</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{feed.errorCount || 0}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Clock" size={14} className="mr-2" />
          Last fetched: {feed.lastFetched 
            ? format(new Date(feed.lastFetched), 'MMM d, yyyy HH:mm')
            : 'Never'
          }
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} className="mr-2" />
          Added: {format(new Date(feed.createdAt), 'MMM d, yyyy')}
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"  
              icon="Settings"
              onClick={() => onEdit(feed)}
            >
              Edit
            </Button>
            <Button
              variant={feed.isActive ? "ghost" : "primary"}
              size="sm"
              icon={feed.isActive ? "Pause" : "Play"}
              onClick={handleToggleStatus}
              loading={loading}
            >
              {feed.isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FeedCard;