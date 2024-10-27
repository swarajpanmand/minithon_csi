// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAZWJZ_S4QSZVR-GukZqLLm8E6-_WG-OmQ",
//   authDomain: "financeflow-6d9cd.firebaseapp.com",
//   projectId: "financeflow-6d9cd",
//   projectId: "finansync-c8ae6",
//   storageBucket: "financeflow-6d9cd.appspot.com",
//   messagingSenderId: "956926070616",
//   appId: "1:956926070616:web:123575d8de38276eb65f2d",
//   measurementId: "G-E8EXYY6PXP",
// };

const firebaseConfig = {
  apiKey: "AIzaSyB8s60VbPm-BM9ZVexPARh7aO5srfsDkoo",
  authDomain: "finansync-c8ae6.firebaseapp.com",
  projectId: "finansync-c8ae6",
  storageBucket: "finansync-c8ae6.appspot.com",
  messagingSenderId: "51201476555",
  appId: "1:51201476555:web:8040df7e72e7ee9083184e",
  measurementId: "G-48XPNHWTXL"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
