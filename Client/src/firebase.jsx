
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernapp-6e488.firebaseapp.com",
  projectId: "mernapp-6e488",
  storageBucket: "mernapp-6e488.appspot.com",
  messagingSenderId: "536088247858",
  appId: "1:536088247858:web:361e7040eb5130f75e462b"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);