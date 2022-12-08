import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR5JCqdb6HR_ZPiiljF7KbAC8VA75yg1U",
  authDomain: "aura-806cb.firebaseapp.com",
  databaseURL:
    "https://aura-806cb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aura-806cb",
  storageBucket: "aura-806cb.appspot.com",
  messagingSenderId: "401675120157",
  appId: "1:401675120157:web:2ea7ce8cae71fcffde60f4",
  measurementId: "G-K836WXSPSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authetication = getAuth(app);
