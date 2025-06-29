import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { onSidebarToggle } = useOutletContext();
  const [settings, setSettings] = useState({
    notifications: {
      newArticles: true,
      weeklyDigest: true,
      systemUpdates: false,
      emailNotifications: true
    },
    display: {
      articlesPerPage: 12,
      defaultView: 'grid',
      theme: 'light',
      compactMode: false
    },
    privacy: {
      trackReading: true,
      shareBookmarks: false,
      analyticsOptOut: false
    },
    account: {
      name: 'News Reader',
      email: 'reader@example.com',
      role: 'user'
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load from localStorage in real app, would be from API
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setLoading(true);
      // Save to localStorage in real app, would be API call
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleDisplayChange = (key, value) => {
    const newSettings = {
      ...settings,
      display: {
        ...settings.display,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handlePrivacyChange = (key, value) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleAccountChange = (key, value) => {
    const newSettings = {
      ...settings,
      account: {
        ...settings.account,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      return;
    }

    try {
      localStorage.clear();
      toast.success('All data cleared successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };

  const exportData = () => {
    try {
      const data = {
        settings,
        bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
        readArticles: JSON.parse(localStorage.getItem('readArticles') || '[]'),
        selectedTopics: JSON.parse(localStorage.getItem('selectedTopics') || '[]')
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedflow-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Customize your FeedFlow experience"
        onSidebarToggle={onSidebarToggle}
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="User" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Display Name"
                value={settings.account.name}
                onChange={(e) => handleAccountChange('name', e.target.value)}
                icon="User"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={settings.account.email}
                onChange={(e) => handleAccountChange('email', e.target.value)}
                icon="Mail"
              />
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Info" size={16} className="text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Role: <span className="font-medium capitalize">{settings.account.role}</span>
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="Bell" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'newArticles', label: 'New Article Notifications', description: 'Get notified when new articles match your topics' },
                { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a summary of top articles each week' },
                { key: 'systemUpdates', label: 'System Updates', description: 'Get notified about app updates and maintenance' },
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' }
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[option.key]}
                      onChange={(e) => handleNotificationChange(option.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="Monitor" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Display Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Articles Per Page
                </label>
                <div className="flex space-x-3">
                  {[6, 12, 18, 24].map((count) => (
                    <Button
                      key={count}
                      variant={settings.display.articlesPerPage === count ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleDisplayChange('articlesPerPage', count)}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Default View Mode
                </label>
                <div className="flex space-x-3">
                  <Button
                    variant={settings.display.defaultView === 'grid' ? 'primary' : 'secondary'}
                    size="sm"
                    icon="Grid3x3"
                    onClick={() => handleDisplayChange('defaultView', 'grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={settings.display.defaultView === 'list' ? 'primary' : 'secondary'}
                    size="sm"
                    icon="List"
                    onClick={() => handleDisplayChange('defaultView', 'list')}
                  >
                    List
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Compact Mode</h3>
                  <p className="text-sm text-gray-600">Show more articles in less space</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.display.compactMode}
                    onChange={(e) => handleDisplayChange('compactMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="Shield" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Data</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'trackReading', label: 'Track Reading History', description: 'Allow the app to track which articles you\'ve read' },
                { key: 'shareBookmarks', label: 'Share Bookmark Data', description: 'Allow anonymous sharing of bookmark patterns for recommendations' },
                { key: 'analyticsOptOut', label: 'Opt Out of Analytics', description: 'Disable anonymous usage analytics' }
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy[option.key]}
                      onChange={(e) => handlePrivacyChange(option.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="Database" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="secondary"
                icon="Download"
                onClick={exportData}
                className="justify-center"
              >
                Export My Data
              </Button>
              
              <Button
                variant="danger"
                icon="Trash2"
                onClick={clearAllData}
                className="justify-center"
              >
                Clear All Data
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Clearing data will remove all your bookmarks, reading history, and preferences.
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6" gradient={true}>
            <div className="flex items-center mb-6">
              <ApperIcon name="Info" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">About FeedFlow</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Version</h3>
                <p className="text-gray-600">1.0.0</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
                <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Build</h3>
                <p className="text-gray-600">React + Vite</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600">help@feedflow.app</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;