import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, orderBy, limit, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// User Management
export const createUserProfile = async (uid, email, role) => {
  await setDoc(doc(db, "users", uid), {
    email,
    role,
    createdAt: new Date(),
    status: "active",
  });
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
};

export const deleteUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  await deleteDoc(docRef);
};

export const suspendUser = async (uid) => {
  await updateUserProfile(uid, { status: "suspended" });
};

export const activateUser = async (uid) => {
  await updateUserProfile(uid, { status: "active" });
};

export const getAllUsers = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Package Management
export const addPackage = async (packageData) => {
  const docRef = await addDoc(collection(db, "packages"), {
    ...packageData,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const getPackages = async (customerId = null, familyId = null) => {
  try {
    let q = collection(db, "packages");
    if (customerId) {
      q = query(q, where("customerId", "==", customerId));
    }
    if (familyId) {
      q = query(q, where("familyId", "==", familyId));
    }
    const querySnapshot = await getDocs(q);
    const packages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: packages };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPackageById = async (packageId) => {
  const docRef = doc(db, "packages", packageId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updatePackageStatus = async (packageId, status) => {
  const docRef = doc(db, "packages", packageId);
  await updateDoc(docRef, { status, updatedAt: new Date() });
};

export const assignPackageToCourier = async (packageId, courierId) => {
  const docRef = doc(db, "packages", packageId);
  await updateDoc(docRef, { assignedCourier: courierId, updatedAt: new Date() });
};

export const transferPackage = async (packageId, newCourierId) => {
  const docRef = doc(db, "packages", packageId);
  await updateDoc(docRef, { assignedCourier: newCourierId, updatedAt: new Date() });
};

export const getAllPackages = async () => {
  const q = query(collection(db, "packages"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Family Member Management
export const addFamilyMember = async (mainUserId, familyMemberData) => {
  const docRef = await addDoc(collection(db, "users"), {
    ...familyMemberData,
    mainUserId,
    role: "customer", // Family members are also customers
    createdAt: new Date(),
  });
  return docRef.id;
};

export const getFamilyMembers = async (mainUserId) => {
  const q = query(collection(db, "users"), where("mainUserId", "==", mainUserId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Subscription Management
export const getSubscriptionByFamilyId = async (familyId) => {
  try {
    const q = query(collection(db, "subscriptions"), where("familyId", "==", familyId), orderBy("createdAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: true, data: { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } };
    } else {
      return { success: false, error: "No active subscription found for this family." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSubscriptionByUserId = async (userId) => {
  const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateSubscription = async (subscriptionId, data) => {
  const docRef = doc(db, "subscriptions", subscriptionId);
  await updateDoc(docRef, data);
};

export const createSubscription = async (userId, servicePackageId) => {
  const docRef = await addDoc(collection(db, "subscriptions"), {
    userId,
    servicePackageId,
    startDate: new Date(),
    endDate: null, // Set based on package duration
    packagesLeft: 0, // Set based on package details
    status: "active",
  });
  return docRef.id;
};

// Service Packages (Predefined)
export const getServicePackages = async () => {
  const q = query(collection(db, "servicePackages"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getServicePackageById = async (packageId) => {
  const docRef = doc(db, "servicePackages", packageId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Courier Stats (Example)
export const getCourierPerformanceStats = async (courierId) => {
  // This would typically involve more complex queries and aggregations
  const q = query(collection(db, "packages"), where("assignedCourier", "==", courierId));
  const querySnapshot = await getDocs(q);
  const packages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const deliveredPackages = packages.filter(p => p.status === "delivered").length;
  const totalPackages = packages.length;

  return {
    deliveredPackages,
    totalPackages,
    deliveryRate: totalPackages > 0 ? (deliveredPackages / totalPackages) * 100 : 0,
  };
};

