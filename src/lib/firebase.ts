import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD18CgpwJD5TJDPqtC1KKnI46x_-_3Bfxk",
  authDomain: "hasagoldstore.firebaseapp.com",
  projectId: "hasagoldstore",
  storageBucket: "hasagoldstore.firebasestorage.app",
  messagingSenderId: "756314904233",
  appId: "1:756314904233:web:399b39ad71481a0bf27bb8",
  measurementId: "G-2VD903GGZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
