


// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration (replace with your config from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAQf9Y_Qj9vuN4Fod4teJ-FZVfCZb2xWxg",
    authDomain: "smart-waste-management-3ecdb.firebaseapp.com",
    projectId: "smart-waste-management-3ecdb",
    storageBucket: "smart-waste-management-3ecdb.appspot.com",
    messagingSenderId: "434571621092",
    appId: "1:434571621092:web:598189ef9fc50b1e6cf2f1",
    measurementId: "G-8E80Q0E5VZ"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase storage
const storage = getStorage(app);

// Export the initialized storage object
export { storage };
