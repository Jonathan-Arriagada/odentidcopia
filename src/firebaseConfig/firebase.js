// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMd3Q_1yJoM08smtCIZ-znfFVul7IHomg",
  authDomain: "odontid-93668.firebaseapp.com",
  projectId: "odontid-93668",
  storageBucket: "odontid-93668.appspot.com",
  messagingSenderId: "26241711261",
  appId: "1:26241711261:web:00ca826d0e1ee9868da874",
  measurementId: "G-D6CXWR76EC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)