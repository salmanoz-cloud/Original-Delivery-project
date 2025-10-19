import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TasksList from '../components/courier/TasksList';
import TaskDetails from '../components/courier/TaskDetails';
import PerformanceStats from '../components/courier/PerformanceStats';
import '../../src/styles/CourierDashboard.css';

function CourierDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'courier')) {
      navigate('/login');
    }
  }, [user, userRole, loading, navigate]);

  const handleLogout = async () => {
    // Implement logout logic here if needed, though typically handled in AuthContext or main App
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="courier-dashboard">
      <h1>Welcome, {user?.email} (Courier)</h1>
      <button onClick={handleLogout}>Logout</button>

      <nav className="courier-nav">
        <button onClick={() => setActiveTab('tasks')}>My Tasks</button>
        <button onClick={() => setActiveTab('stats')}>Performance Stats</button>
      </nav>

      <div className="courier-content">
        {activeTab === 'tasks' && (
          selectedTask ? (
            <TaskDetails task={selectedTask} onBack={() => setSelectedTask(null)} />
          ) : (
            <TasksList onSelectTask={setSelectedTask} />
          )
        )}
        {activeTab === 'stats' && <PerformanceStats />}
      </div>
    </div>
  );
}

export default CourierDashboard;

