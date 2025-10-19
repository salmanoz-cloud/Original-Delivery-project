import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Register with Email and Password
export const registerWithEmail = async (email, password, displayName, phoneNumber, role = "customer") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName,
      email,
      phoneNumber,
      role,
      createdAt: new Date(),
      status: "active",
      familyId: user.uid, // For now, familyId is the same as uid
    });

    // Set custom claim for role
    // This requires a Cloud Function to be called from the client after registration
    // For now, we rely on the Firestore document for roles

    return { success: true, data: { uid: user.uid, displayName, email, phoneNumber, role } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login with Email and Password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("User data not found in Firestore.");
    }
    const userData = userDoc.data();

    return { success: true, data: { uid: user.uid, ...userData } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // If new user, create a Firestore document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        role: "customer", // Default role for Google sign-ups
        createdAt: new Date(),
        status: "active",
        familyId: user.uid,
      });
    }

    const updatedUserDoc = await getDoc(doc(db, "users", user.uid));
    const userData = updatedUserDoc.data();

    return { success: true, data: { uid: user.uid, ...userData } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Current User (with role)
export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Force refresh to get updated custom claims
          const idTokenResult = await user.getIdTokenResult(true);
          const userRole = idTokenResult.claims.role || "customer";

          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            resolve({ success: true, data: { uid: user.uid, ...userDoc.data(), role: userRole } });
          } else {
            resolve({ success: false, error: "User data not found in Firestore." });
          }
        } catch (error) {
          console.error("Error getting user role or data:", error);
          resolve({ success: false, error: error.message });
        }
      } else {
        resolve({ success: false, error: "No user logged in." });
      }
      unsubscribe();
    });
  });
};

// Update User Profile
export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(db, "users", uid), data);
    if (auth.currentUser && auth.currentUser.uid === uid) {
      await updateProfile(auth.currentUser, { displayName: data.displayName, phoneNumber: data.phoneNumber });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add Family Member (secondary user)
export const addFamilyMember = async (primaryUserId, memberData) => {
  try {
    const primaryUserDoc = await getDoc(doc(db, "users", primaryUserId));
    if (!primaryUserDoc.exists()) {
      throw new Error("Primary user not found.");
    }
    const primaryUserData = primaryUserDoc.data();

    const userCredential = await createUserWithEmailAndPassword(auth, memberData.email, memberData.password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: memberData.displayName,
      email: memberData.email,
      phoneNumber: memberData.phoneNumber || null,
      role: "customer",
      createdAt: new Date(),
      status: "active",
      primaryUserId: primaryUserId,
      familyId: primaryUserData.familyId,
    });

    return { success: true, data: { uid: user.uid, ...memberData, role: "customer" } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Suspend User
export const suspendUser = async (uid) => {
  try {
    await updateDoc(doc(db, "users", uid), { status: "suspended" });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Activate User
export const activateUser = async (uid) => {
  try {
    await updateDoc(doc(db, "users", uid), { status: "active" });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



// Get user role
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    } else {
      console.warn("No user document found for uid:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

