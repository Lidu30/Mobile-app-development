// initialize Firebase app
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "src/firebaseConfig.js";
const app= initializeApp(firebaseConfig);

// initialize Firestore
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
const db= getFirestore(app);

// make doc and setDoc available at the Console for testing
global.doc= doc        
global.setDoc= setDoc
global.db= db

/* Replace NN with your TW2_TW3 group number! */
const COLLECTION="dinnerModelNN";

// TODO: read the code above
// TODO: export the function connectToPersistence, it can be empty for starters
