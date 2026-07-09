import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYyFMxtkNssK0dRXtk82rxM7UpvyQrB3w",
  authDomain: "koriz-81eb2.firebaseapp.com",
  projectId: "koriz-81eb2",
  storageBucket: "koriz-81eb2.firebasestorage.app",
  messagingSenderId: "1045783522589",
  appId: "1:1045783522589:web:94516cad5b81bf02fc05f4",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;