import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebase = initializeApp(
  {
    apiKey: "AIzaSyAeUfdSVFiMJwTzdcVzwZ7KEQSn8HOfdIs",
    authDomain: "feizi-lab.firebaseapp.com",
    projectId: "feizi-lab",
    storageBucket: "feizi-lab.appspot.com",
    messagingSenderId: "704347819382",
    appId: "1:704347819382:web:4170efa25ca47397eafe57",
  },
  "web"
);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);
export const provider = new GoogleAuthProvider();
