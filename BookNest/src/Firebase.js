// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBi6_-ywKIVwNNHtAjuaYrGS5EzRmj4sxU",
  authDomain: "booknest-748fc.firebaseapp.com",
  projectId: "booknest-748fc",
  storageBucket: "booknest-748fc.appspot.com",
  messagingSenderId: "328477228164",
  appId: "1:328477228164:web:85c5964e3c3383234d56d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
console.log("Firebase App Initialized:" ,db);

export default app;