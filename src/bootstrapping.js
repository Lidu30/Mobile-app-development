import "./teacherFetch"

import { configure, observable, reaction } from "mobx"

import { dishesConst } from "./dishesConst"

//——————————————————————————————————————————————————————————————————————————————

configure({ enforceActions: "never" })

export const reactiveModel = "TODO make a reactive model here"

// make the model and a few example dishes available in the browser Console for testing
global.myModel = reactiveModel
global.dishesConst = dishesConst

// or you can add a few dishes here, don't forget to remove this in TW2
// myModel.numberOfGuests = 3
// myModel.addToMenu(dishesConst[0])
