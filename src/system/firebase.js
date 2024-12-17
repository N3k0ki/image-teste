import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBtIClS91NTN7c2s5BFs7Hmtu6VO_n7iX4",
    authDomain: "coral-guard.firebaseapp.com",
    projectId: "coral-guard",
    storageBucket: "coral-guard.firebasestorage.app",
    messagingSenderId: "527306576350",
    appId: "1:527306576350:web:536023b5ce97d8cbb24d4f",
    measurementId: "G-NHTGMMN6JF"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage };
export {db};