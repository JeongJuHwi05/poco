import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLSXh9EZ930U8JlSU1fLSBUJmR6Ladmxs",
  authDomain: "react-project-d0dda.firebaseapp.com",
  projectId: "react-project-d0dda",
  storageBucket: "react-project-d0dda.appspot.com",
  messagingSenderId: "974544064156",
  appId: "1:974544064156:web:f49f652551309030816759"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);