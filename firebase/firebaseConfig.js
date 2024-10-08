// firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAu8v1Q9fxynqAEm-MMCYeOXvhl6OkUJDk",
    authDomain: "chaton-db.firebaseapp.com",
    projectId: "chaton-db",
    storageBucket: "chaton-db.appspot.com",
    messagingSenderId: "773709015819",
    appId: "1:773709015819:web:8e867e83396374223f900e"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
  
export { db };
