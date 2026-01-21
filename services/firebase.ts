import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAPC-PciJOrOYTMt9fFLQup1SQ7n31QCro",
    authDomain: "benim-televizyonum-6791f.firebaseapp.com",
    projectId: "benim-televizyonum-6791f",
    storageBucket: "benim-televizyonum-6791f.firebasestorage.app",
    messagingSenderId: "360775517129",
    appId: "1:360775517129:web:a9db393cc0bca6058c5e18",
    measurementId: "G-4XP0D3C927"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
