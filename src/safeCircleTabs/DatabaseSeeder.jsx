import React, { useState } from 'react';
import { seedDatabase, clearDatabase } from './api/sampleData';
import { useAuth } from '../AuthContext';
import './DatabaseSeeder.css';

const DatabaseSeeder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Only show this component if user is admin
  // Temporarily disabled for development - uncomment in production
  // if (!user?.isAdmin?.()) {
  //   return null;
  // }

  const handleSeedDatabase = async () => {
    setLoading(true);
    setMessage('Seeding database with sample data...');

    try {
      const success = await seedDatabase();
      if (success) {
        setMessage('✅ Database seeded successfully! Refresh the page to see the sample stories.');
      } else {
        setMessage('❌ Failed to seed database. Check console for errors.');
      }
    } catch (error) {
      console.error('Seeding error:', error);
      setMessage('❌ Error seeding database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      return;
    }

    setLoading(true);
    setMessage('Clearing database...');

    try {
      const success = await clearDatabase();
      if (success) {
        setMessage('✅ Database cleared successfully!');
      } else {
        setMessage('❌ Failed to clear database. Check console for errors.');
      }
    } catch (error) {
      console.error('Clearing error:', error);
      setMessage('❌ Error clearing database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="database-seeder">
      <h3>🛠️ Database Management (Development Mode)</h3>
      <div className="seeder-actions">
        <button
          onClick={handleSeedDatabase}
          disabled={loading}
          className="seed-btn"
        >
          {loading ? 'Seeding...' : '🌱 Seed Sample Data'}
        </button>
        <button
          onClick={handleClearDatabase}
          disabled={loading}
          className="clear-btn"
        >
          {loading ? 'Clearing...' : '🗑️ Clear All Data'}
        </button>
      </div>
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <div className="sample-info">
        <h4>Sample Data Includes:</h4>
        <ul>
          <li>6 diverse survivor stories (male/female perspectives)</li>
          <li>6 story categories (Domestic Violence, Sexual Assault, etc.)</li>
          <li>Sample comments and engagement metrics</li>
          <li>Various abuse types and recovery journeys</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseSeeder;