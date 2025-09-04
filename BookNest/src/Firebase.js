// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBi6_-ywKIVwNNHtAjuaYrGS5EzRmj4sxU",
  authDomain: "booknest-748fc.firebaseapp.com",
  projectId: "booknest-748fc",
  storageBucket: "booknest-748fc.firebasestorage.app",
  messagingSenderId: "328477228164",
  appId: "1:328477228164:web:85c5964e3c3383234d56d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// console.log("Firebase App Initialized:", app,auth);

export default app