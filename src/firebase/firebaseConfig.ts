// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDtsSdADXfaG2t2ncURIExtIJOhDo5anfY",
    authDomain: "dardibook.firebaseapp.com",
    projectId: "dardibook",
    storageBucket: "dardibook.appspot.com",
    messagingSenderId: "407837886231",
    appId: "1:407837886231:web:af4fa3c0e2807fb226d952"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider, firebaseConfig, db };