import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import TasksList from '../components/courier/TasksList';
import TaskDetails from '../components/courier/TaskDetails';
import PerformanceStats from '../components/courier/PerformanceStats';
import '../styles/CourierDashboard.css';

function CourierDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      if (result.success && result.data.role === 'courier') {
        setUser(result.data);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const handleTaskUpdated = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div className="courier-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>דשבורד שליח</h1>
          <p>ברוכים הבאים, {user?.displayName}!</p>
        </div>
        <button onClick={handleLogout} className="button button-danger">
          התנתקות
        </button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Left Column - Tasks */}
          <div className="left-column">
            <div className="card">
              <TasksList
                key={refreshKey}
                courierId={user?.uid}
                onSelectTask={setSelectedTask}
              />
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="right-column">
            <div className="card">
              <PerformanceStats courierId={user?.uid} />
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

export default CourierDashboard;

