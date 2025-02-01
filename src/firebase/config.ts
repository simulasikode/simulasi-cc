// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOP3UhZ2B-7naisuTn1JDfqHGbZ8HmzM8",
  authDomain: "studiosimulasi.firebaseapp.com",
  projectId: "studiosimulasi",
  storageBucket: "studiosimulasi.appspot.com",
  messagingSenderId: "228696722817",
  appId: "1:228696722817:web:72d572a227fd49fb40ec80",
  measurementId: "G-2EQYKBXGNE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
