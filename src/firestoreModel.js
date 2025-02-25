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
const COLLECTION="dinnerModel11";

export function connectToPersistence(reactiveModel, reaction) {
    
    function getModelStateACB() {
        return {
            numberOfGuests: reactiveModel.numberOfGuests,
            dishes: reactiveModel.dishes,
            currentDish: reactiveModel.currentDish,
        };
    }

    function persistenceModelACB(modelState){
        const refObject = doc(db,COLLECTION, "modelData");
        setDoc(refObject, modelState, {merge:true});
    }

    reaction(getModelStateACB, persistenceModelACB);
    
}


