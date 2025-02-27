import { initializeApp } from "firebase/app"
// initialize Firestore
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { firebaseConfig } from "src/firebaseConfig.js"

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

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
    const refObject = doc(db, COLLECTION, "modelData")
    if (model.ready) {
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
  }


  watchFunction(getModelStateACB, persistenceModelACB)
}
