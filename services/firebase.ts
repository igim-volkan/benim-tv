import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// BASIC VALIDATION
console.log("[Firebase] Yapılandırma kontrol ediliyor...");
const missingVars = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value && key !== 'measurementId')
    .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, letter => `_${letter.toUpperCase()}`).toUpperCase()}`);

if (missingVars.length > 0) {
    console.error("[Firebase] EKSİK ÇEVRE DEĞİŞKENLERİ:", missingVars.join(", "));
    console.warn("[Firebase] Uygulama düzgün çalışmayabilir. Lütfen .env dosyasını kontrol edin.");
} else {
    console.log("[Firebase] Yapılandırma geçerli görünüyor.");
    console.log("[Firebase] Project ID:", firebaseConfig.projectId);
    console.log("[Firebase] API Key (İpucu):", firebaseConfig.apiKey?.substring(0, 7) + "...");
}



import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics could not be initialized:", e);
}
export { analytics };
export const db = getFirestore(app);
export const auth = getAuth(app);
