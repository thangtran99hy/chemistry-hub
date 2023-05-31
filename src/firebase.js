import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyA36FpfGi8XNRRy6c0oshTrMIEtYfc-gxs",
    authDomain: "chemistry-hub-2ac6f.firebaseapp.com",
    projectId: "chemistry-hub-2ac6f",
    storageBucket: "chemistry-hub-2ac6f.appspot.com",
    messagingSenderId: "801294166206",
    appId: "1:801294166206:web:aef7279c4a94ac178f16ef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
