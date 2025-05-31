import { initializeApp } from "firebase/app"
// initialize Firestore
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { firebaseConfig } from "src/firebaseConfig.js"

const app = initializeApp(firebaseConfig)
//db is the firestore database instance
const db = getFirestore(app)
export const auth = getAuth(app)

// make doc and setDoc available at the Console for testing
global.doc = doc
global.setDoc = setDoc
global.db = db

/* Replace NN with your TW2_TW3 group number! */
const COLLECTION = "dinnerModel11"

export function connectToPersistence(model, watchFunction) {
    function getModelStateACB() {
        return [model.numberOfGuests, model.dishes, model.currentDishId]
    }

    function persistenceModelACB() {
        //creates a refrence to a specific document on the Firestore database
        if (!model.ready || !model.user) return;

        // FIX: Use user.uid instead of "modelData"
        const refObject = doc(db, COLLECTION, model.user.uid)
        setDoc(
            refObject,
            {
            numberOfGuests: model.numberOfGuests,
            dishes: model.dishes,
            currentDishId: model.currentDishId,
            },
            { merge: true },
        )
    }

    // Why does the section below needs to be only just before or after installing the side effect

        //check the getDoc() promise error
    function errorACB(error) {
        console.error(
            "Could not reach cloud Firestore backend. Connection failed 1 times:", error)
    } 

    function readFromPersistenceACB(){
        if (!model.user) {
            model.numberOfGuests = 2;
            model.dishes = [];
            model.currentDishId = null;
            model.ready = true;
            return;
        }

        model.ready = false;
        const refObject = doc(db, COLLECTION, model.user.uid);

        getDoc(refObject).then(function readyACB(docSnap) {
            const data = docSnap.data();
            if (data) {
                model.numberOfGuests = data.numberOfGuests || 2;
                model.dishes = data.dishes || [];
                model.currentDishId = data.currentDishId || null;
            } else {
                model.numberOfGuests = 2;
                model.dishes = [];
                model.currentDishId = null;
            }
            model.ready = true;   
        }).catch(errorACB);
    }

    // this is for every time a user logs in or logs out
    onAuthStateChanged(auth, function authChangeACB(user) {
        model.user = user;
        
        if (user) {
            readFromPersistenceACB();
        //if the user just signed up
        } else {
            model.numberOfGuests = 2;
            model.dishes = [];
            model.currentDishId = null;
        }
    });
        
    watchFunction(getModelStateACB, persistenceModelACB);
}