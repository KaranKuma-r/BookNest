import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:"AIzaSyBi6_-ywKIVwNNHtAjuaYrGS5EzRmj4sxU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:"booknest-748fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ CORRECT WAY (THIS FIXES EVERYTHING)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Auth & Storage
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("Firebase initialized correctly");

export default app;
