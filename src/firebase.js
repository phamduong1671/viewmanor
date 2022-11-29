import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "viewmanor-1eafb.firebaseapp.com",
  projectId: "viewmanor-1eafb",
  storageBucket: "viewmanor-1eafb.appspot.com",
  messagingSenderId: "1064579715767",
  appId: "1:1064579715767:web:b1264eaf0f409a830c7332"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();