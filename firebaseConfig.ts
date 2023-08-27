import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf7QpxfQIc-UU-famBE47hNTXBkYccs8M",
  authDomain: "studybuddy-a980f.firebaseapp.com",
  projectId: "studybuddy-a980f",
  storageBucket: "studybuddy-a980f.appspot.com",
  messagingSenderId: "107501556428",
  appId: "1:107501556428:web:ba055d65f79d717032e869",
  measurementId: "G-XE98Y5BKDL",
  databaseURL: "https://studybuddy-a980f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const GOOGLE_AUTH = new GoogleAuthProvider();
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
