// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZWJZ_S4QSZVR-GukZqLLm8E6-_WG-OmQ",
  authDomain: "financeflow-6d9cd.firebaseapp.com",
  projectId: "financeflow-6d9cd",
  storageBucket: "financeflow-6d9cd.appspot.com",
  messagingSenderId: "956926070616",
  appId: "1:956926070616:web:123575d8de38276eb65f2d",
  measurementId: "G-E8EXYY6PXP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
