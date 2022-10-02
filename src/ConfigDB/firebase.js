import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD67LdqPOB0Yfh7APE3RZetBb0IeQqQMyw",
    authDomain: "hairsalon-6595c.firebaseapp.com",
    projectId: "hairsalon-6595c",
    storageBucket: "hairsalon-6595c.appspot.com",
    messagingSenderId: "435173415002",
    appId: "1:435173415002:web:a5c2dc02a9918eef406063",
    measurementId: "G-BVX0Z7NT06",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
