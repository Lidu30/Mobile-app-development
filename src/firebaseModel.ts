import { initializeApp } from "firebase/app"
import { get, getDatabase, ref, set } from "firebase/database"

import type { DinnerModel } from "./DinnerModel"
import { getMenuDetails } from "./dishSource"
import { firebaseConfig } from "./firebaseConfig"

export interface PersistenceData {
  guests: number
  currentDishId: number | null
  dishes: number[] // Array of dish IDs
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const REF = "dinnerModel200-test5"
const rf = ref(db, REF)

export async function persistenceToModel(
  data: PersistenceData | null,
  model: DinnerModel,
): Promise<void> {
  model.setNumberOfGuests(data?.guests || 2)
  model.setCurrentDishId(data?.currentDishId || null)
  model.dishes = await getMenuDetails(data?.dishes || [])
}

export function modelToPersistence(model: DinnerModel): PersistenceData {
  return {
    guests: model.numberOfGuests,
    currentDishId: model.currentDishId,
    dishes: model.dishes.map((d) => d.id).sort(),
  }
}

export function saveToFirebase(model: DinnerModel): void {
  if (model.ready) {
    set(rf, modelToPersistence(model))
  }
}

export async function readFromFirebase(model: DinnerModel): Promise<void> {
  model.ready = false
  const snapshot = await get(rf)
  await persistenceToModel(snapshot.val(), model)
  model.ready = true
}

export function connectToFirebase(
  myModel: DinnerModel,
  register: (getDependencies: () => unknown[], callback: () => void) => void,
): void {
  register(
    () => [myModel.numberOfGuests, myModel.dishes, myModel.currentDishId],
    () => {
      saveToFirebase(myModel)
    },
  )
  readFromFirebase(myModel)
}
