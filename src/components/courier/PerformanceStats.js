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
    </div>
  );
}

export default PerformanceStats;

