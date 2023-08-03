import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoEzBOwich2I3smps10PpdGyprzBIbSW8",
  authDomain: "po-co-306aa.firebaseapp.com",
  projectId: "po-co-306aa",
  storageBucket: "po-co-306aa.appspot.com",
  messagingSenderId: "118737389663",
  appId: "1:118737389663:web:068128d0b46f1a9c9673ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);