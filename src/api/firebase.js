import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAgjq568rn8avxOfJg8EUfQBY5ipzPfd7A",
//   authDomain: "teramed-dca13.firebaseapp.com",
//   databaseURL: "https://teramed-dca13-default-rtdb.firebaseio.com",
//   projectId: "teramed-dca13",
//   storageBucket: "teramed-dca13.appspot.com",
//   messagingSenderId: "1079664700515",
//   appId: "1:1079664700515:web:18ef2ee000af516641dc56",
//   measurementId: "G-RBHWBLSTJ8"
// };

const firebaseConfig = {
    apiKey: "AIzaSyC_Yyl60bAzszPzP1dQmQQBnWAzzjnJ2oU",
    authDomain: "teramed-84870.firebaseapp.com",
    projectId: "teramed-84870",
    storageBucket: "teramed-84870.appspot.com",
    messagingSenderId: "56007960250",
    appId: "1:56007960250:web:cd20d3400a6fe4d5474483",
    measurementId: "G-KBL6Z6W5NQ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableMultiTabIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support all of the features required to enable persistence.');
    }
  });

export { db };




