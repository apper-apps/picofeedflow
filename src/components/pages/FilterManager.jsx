import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { filterService } from '@/services/api/filterService';
import { toast } from 'react-toastify';

const FilterManager = () => {
  const { onSidebarToggle } = useOutletContext();
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await filterService.getAll();
      setFilters(data);
    } catch (err) {
      setError('Failed to load filters');
      console.error('Error loading filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    // Check for duplicate keywords
    const exists = filters.some(filter => 
      filter.keyword.toLowerCase() === formData.keyword.toLowerCase()
    );
    
    if (exists) {
      toast.error('This keyword already exists');
      return;
    }

    try {
      setFormLoading(true);
      const newFilter = await filterService.create(formData);
      setFilters(prev => [newFilter, ...prev]);
      setFormData({ keyword: '', isActive: true });
      setShowAddForm(false);
      toast.success('Filter added successfully');
    } catch (error) {
      toast.error('Failed to add filter');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (filterId, isActive) => {
    try {
      await filterService.update(filterId, { isActive });
      setFilters(prev => prev.map(filter => 
        filter.Id === filterId ? { ...filter, isActive } : filter
      ));
      toast.success(`Filter ${isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update filter');
    }
  };

  const handleDelete = async (filterId) => {
    if (!window.confirm('Are you sure you want to delete this filter?')) {
      return;
    }

    try {
      await filterService.delete(filterId);
      setFilters(prev => prev.filter(filter => filter.Id !== filterId));
      toast.success('Filter deleted successfully');
    } catch (error) {
      toast.error('Failed to delete filter');
    }
  };

  const headerActions = [
    {
      label: 'Add Filter',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => setShowAddForm(true)
    }
  ];

  if (loading && filters.length === 0) {
    return (
      <div className="min-h-screen">
        <Header
          title="Content Filters"
          subtitle="Manage keyword filters for content moderation"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error && filters.length === 0) {
    return (
      <div className="min-h-screen">
        <Header
          title="Content Filters"
          subtitle="Manage keyword filters for content moderation"
          onSidebarToggle={onSidebarToggle}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadFilters} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Content Filters"
        subtitle="Manage global keyword filters to block unwanted content"
        onSidebarToggle={onSidebarToggle}
        actions={headerActions}
      />

      <div className="p-6 space-y-6">
        {/* Add Filter Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6" gradient={true}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Filter</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => setShowAddForm(false)}
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Keyword"
                        placeholder="e.g., spam, crypto, inappropriate..."
                        value={formData.keyword}
                        onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                        required
                        icon="Filter"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <ApperIcon name="Info" size={16} className="inline mr-1" />
                      Filters are applied to all incoming articles automatically
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={formLoading}
                        icon="Plus"
                      >
                        Add Filter
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Statistics */}
        {filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6" gradient={true}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {filters.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Filters</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {filters.filter(f => f.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Filters</div>
                </div>
                
                <div className="text-center p-4 bg-accent-50 rounded-lg">
                  <div className="text-2xl font-bold text-accent-600">
                    {filters.reduce((sum, f) => sum + (f.blockedCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Articles Blocked</div>
                </div>
                
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600">
                    {Math.round((filters.reduce((sum, f) => sum + (f.blockedCount || 0), 0) / Math.max(1, filters.length)) * 100) / 100}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Blocks/Filter</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Filters List */}
        {filters.length === 0 ? (
          <Empty
            icon="Filter"
            title="No content filters configured"
            description="Add keyword filters to automatically block unwanted content from all RSS feeds."
            action={
              <Button onClick={() => setShowAddForm(true)} icon="Plus">
                Add Your First Filter
              </Button>
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden" gradient={true}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Active Filters</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filters.map((filter) => (
                    <motion.div
                      key={filter.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Filter" size={18} className="text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">{filter.keyword}</h3>
                            <Badge variant={filter.isActive ? 'success' : 'default'}>
                              {filter.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Blocked {filter.blockedCount || 0} articles • Created {new Date(filter.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={filter.isActive ? "ghost" : "secondary"}
                          size="sm"
                          icon={filter.isActive ? "Pause" : "Play"}
                          onClick={() => handleToggleStatus(filter.Id, !filter.isActive)}
                        >
                          {filter.isActive ? 'Disable' : 'Enable'}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(filter.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterManager;