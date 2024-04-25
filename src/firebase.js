import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAgjq568rn8avxOfJg8EUfQBY5ipzPfd7A",
    authDomain: "teramed-dca13.firebaseapp.com",
    databaseURL: "https://teramed-dca13-default-rtdb.firebaseio.com",
    projectId: "teramed-dca13",
    storageBucket: "teramed-dca13.appspot.com",
    messagingSenderId: "1079664700515",
    appId: "1:1079664700515:web:18ef2ee000af516641dc56",
    measurementId: "G-RBHWBLSTJ8"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);






