// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCabF5-vVqAq2j_dr9tqqSiMt-KmX63v1s",
  authDomain: "safespace-3e7fe.firebaseapp.com",
  databaseURL: "https://safespace-3e7fe-default-rtdb.firebaseio.com",
  projectId: "safespace-3e7fe",
  storageBucket: "safespace-3e7fe.firebasestorage.app",
  messagingSenderId: "1053359346978",
  appId: "1:1053359346978:web:2a4df24bb9ecb53a9ac17b",
  measurementId: "G-79B5B0K07D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;