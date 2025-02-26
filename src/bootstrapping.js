import "./teacherFetch"

import { configure, observable, reaction } from "mobx"

import { model } from "./DinnerModel"
import { dishesConst } from "./dishesConst"

import { connectToPersistence } from "./firestoreModel"

//——————————————————————————————————————————————————————————————————————————————

configure({ enforceActions: "never" })

export const reactiveModel = observable(model)

// make the model and a few example dishes available in the browser Console for testing
// global.myModel = reactiveModel
//global.dishesConst = dishesConst

reaction(currentDishIdACB, currentDishEffectACB)

function currentDishIdACB() {
  return reactiveModel.currentDishId
}

function currentDishEffectACB() {
  reactiveModel.currentDishEffect()
}

reactiveModel.doSearch({});

// or you can add a few dishes here, don't forget to remove this in TW2
// myModel.numberOfGuests = 3
// myModel.addToMenu(dishesConst[0])

// myModel.currentDishId= 715446

connectToPersistence(reactiveModel, reaction); 
