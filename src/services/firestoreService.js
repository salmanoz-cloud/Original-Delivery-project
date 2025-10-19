import { db } from "../firebaseConfig";
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from "firebase/firestore";

// Users Collection
export const createUserProfile = async (uid, data) => {
  try {
    await setDoc(doc(db, "users", uid), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No such document!" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Packages Collection
export const addPackage = async (packageData) => {
  try {
    const docRef = await addDoc(collection(db, "packages"), {
      ...packageData,
      createdAt: new Date(),
      status: "pending", // Initial status
    });
    return { success: true, data: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPackages = async (customerId = null, familyId = null) => {
  try {
    let q = query(collection(db, "packages"));
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

export const updatePackageStatus = async (packageId, status, courierId = null) => {
  try {
    const docRef = doc(db, "packages", packageId);
    const updateData = { status, updatedAt: new Date() };
    if (courierId) {
      updateData.courierId = courierId;
    }
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Companies/Families Collection
export const createFamily = async (familyData) => {
  try {
    const docRef = await addDoc(collection(db, "families"), {
      ...familyData,
      createdAt: new Date(),
    });
    return { success: true, data: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFamily = async (familyId) => {
  try {
    const docRef = doc(db, "families", familyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No such family!" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Subscriptions Collection
export const createSubscription = async (subscriptionData) => {
  try {
    const docRef = await addDoc(collection(db, "subscriptions"), {
      ...subscriptionData,
      createdAt: new Date(),
      status: "active",
    });
    return { success: true, data: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

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

export const updateSubscription = async (subscriptionId, data) => {
  try {
    const docRef = doc(db, "subscriptions", subscriptionId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Service Packages Collection
export const getServicePackages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "servicePackages"));
    const servicePackages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: servicePackages };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

