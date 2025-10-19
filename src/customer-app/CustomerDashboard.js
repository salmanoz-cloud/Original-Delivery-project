import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPackagesByUserId, getFamilyMembers, getSubscriptionByUserId, updatePackageStatus } from '../services/firestoreService';
import AddPackageModal from '../components/AddPackageModal';
import AddFamilyMemberModal from '../components/AddFamilyMemberModal';
import PackagesList from '../components/PackagesList';
import SubscriptionCard from '../components/SubscriptionCard';
import '../styles/CustomerDashboard.css';

function CustomerDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [isAddFamilyMemberModalOpen, setIsAddFamilyMemberModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'customer')) {
      navigate('/login');
    }

    if (user) {
      fetchCustomerData();
    }
  }, [user, userRole, loading, navigate]);

  const fetchCustomerData = async () => {
    const userPackages = await getPackagesByUserId(user.uid);
    setPackages(userPackages);

    const userFamilyMembers = await getFamilyMembers(user.uid);
    setFamilyMembers(userFamilyMembers);

    const userSubscription = await getSubscriptionByUserId(user.uid);
    setSubscription(userSubscription);
  };

  const handleUpdatePackageStatus = async (packageId, newStatus) => {
    await updatePackageStatus(packageId, newStatus);
    fetchCustomerData();
  };

  const handleLogout = async () => {
    // Implement logout logic here if needed, though typically handled in AuthContext or main App
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      <h1>Welcome, {user?.email} (Customer)</h1>
      <button onClick={() => setIsAddPackageModalOpen(true)}>Add New Package</button>
      <button onClick={() => setIsAddFamilyMemberModalOpen(true)}>Add Family Member</button>
      <button onClick={handleLogout}>Logout</button>

      <SubscriptionCard subscription={subscription} />
      <PackagesList packages={packages} onUpdateStatus={handleUpdatePackageStatus} />

      <AddPackageModal
        isOpen={isAddPackageModalOpen}
        onClose={() => setIsAddPackageModalOpen(false)}
        onPackageAdded={fetchCustomerData}
      />
      <AddFamilyMemberModal
        isOpen={isAddFamilyMemberModalOpen}
        onClose={() => setIsAddFamilyMemberModalOpen(false)}
        onFamilyMemberAdded={fetchCustomerData}
      />
    </div>
  );
}

export default CustomerDashboard;

