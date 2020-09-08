import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCQLUnP59Xhk5XPoChPTxMt75f-bUstVN8",
  authDomain: "kaisblog.firebaseapp.com",
  databaseURL: "https://kaisblog.firebaseio.com",
  projectId: "kaisblog",
  storageBucket: "kaisblog.appspot.com",
  messagingSenderId: "998786562418",
  appId: "1:998786562418:web:6c197962a3671ce76c85eb",
  measurementId: "G-1PZLM7CP9X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firestore };
