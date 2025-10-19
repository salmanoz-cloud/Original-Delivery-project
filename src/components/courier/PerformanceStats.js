<<<<<<< HEAD
import React from 'react';
import '../../styles/courier/PerformanceStats.css';

function PerformanceStats({ courierId }) {
  // In a real application, you would fetch performance data for the courierId
  // For now, using mock data
  const mockStats = {
    deliveredPackages: 120,
    successRate: 98,
    avgDeliveryTime: '25 דקות',
    rating: 4.8,
    todayProgress: 7,
    totalToday: 10,
  };

  return (
    <div className="performance-stats card">
      <h3>סטטיסטיקות ביצועים</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{mockStats.deliveredPackages}</span>
          <span className="stat-label">חבילות נמסרו</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{mockStats.successRate}%</span>
          <span className="stat-label">שיעור הצלחה</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{mockStats.avgDeliveryTime}</span>
          <span className="stat-label">זמן מסירה ממוצע</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{mockStats.rating} ⭐</span>
          <span className="stat-label">דירוג</span>
        </div>
      </div>

      <div className="today-progress">
        <h4>התקדמות היום</h4>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(mockStats.todayProgress / mockStats.totalToday) * 100}%` }}
          ></div>
        </div>
        <p>{mockStats.todayProgress} מתוך {mockStats.totalToday} משימות הושלמו</p>
      </div>
=======
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCourierPerformanceStats } from '../../services/firestoreService';
import '../../styles/courier/PerformanceStats.css';

function PerformanceStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const courierStats = await getCourierPerformanceStats(user.uid);
      setStats(courierStats);
    } catch (err) {
      setError('Failed to fetch performance stats: ' + err.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading performance stats...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="performance-stats">
      <h2>Performance Statistics</h2>
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Delivered Packages</h3>
            <p>{stats.deliveredPackages}</p>
          </div>
          <div className="stat-card">
            <h3>Total Packages</h3>
            <p>{stats.totalPackages}</p>
          </div>
          <div className="stat-card">
            <h3>Delivery Rate</h3>
            <p>{stats.deliveryRate.toFixed(2)}%</p>
          </div>
        </div>
      ) : (
        <p>No performance data available.</p>
      )}
>>>>>>> c87fb12b (Add all generated and modified files to the repository.)
    </div>
  );
}

export default PerformanceStats;

