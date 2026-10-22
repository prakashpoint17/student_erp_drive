import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Super Admin Email
export const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "erprvs@gmail.com";

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAP5ApwLy8KpY_-MwFPMY0vtTEyKmtueyk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rvs-erp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rvs-erp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rvs-erp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "297741855248",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:297741855248:web:4fe0e69e40ffd769dc3895",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RV0135Z8EH"
};

// Check if live Firebase is configured
export const isRealFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("Mock")
);

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firebase Authentication Service
export const FirebaseAuthService = {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        mode: "live_firebase",
        user: {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        }
      };
    } catch (error) {
      console.error("Firebase Google Sign-in Error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Signout error:", e);
    }
  }
};

export { app, auth, db, googleProvider };
