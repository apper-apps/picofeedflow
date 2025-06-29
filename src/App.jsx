import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import AdminDashboard from '@/components/pages/AdminDashboard';
import UserDashboard from '@/components/pages/UserDashboard';
import FeedManager from '@/components/pages/FeedManager';
import FilterManager from '@/components/pages/FilterManager';
import ArticleView from '@/components/pages/ArticleView';
import TopicManager from '@/components/pages/TopicManager';
import BookmarksPage from '@/components/pages/BookmarksPage';
import SettingsPage from '@/components/pages/SettingsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="feeds" element={<FeedManager />} />
            <Route path="filters" element={<FilterManager />} />
            <Route path="topics" element={<TopicManager />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="article/:id" element={<ArticleView />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;