import {model} from "src/DinnerModel"

jest.mock("mobx", ()=>{
  const mobx=jest.requireActual('mobx')    

  const mobxReaction=mobx.reaction;
  const mobxReactionAcbs=[];

  return { ...mobx, mobxReactionAcbs,
  reaction(a, b){
    mobxReactionAcbs.push(...[a, b])
    return mobxReaction(a,b)
  }
 }
})

import {mobxReactionAcbs} from "mobx";
import {checkCB} from "./utils/checkCB"

import {reactiveModel} from "src/bootstrapping"

// Move mock implementation outside of jest.mock()
const mockDishDetails = (id: number) => {
  return Promise.resolve({id})
}

jest.mock("src/firestoreModel", () => ({
  connectToPersistence: jest.fn(() => null),
}))

// Create mock module factory
jest.mock("src/dishSource", () => ({
  getDishDetails: jest.fn((id: number) => mockDishDetails(id)),
  searchDishes: jest.fn(()=>null)
}))

describe("TW2.2.3 Promise State in Model with currentDish", () => {
  it("Model defines property currentDishPromiseState initialized to empty object", () => {
    expect(model.currentDishPromiseState).toEqual({})
  })

  it("currentDishEffect sets currentDishPromiseState if currentDishId is truthy", async function tw2_2_3_2() {
    
    // Model defines property currentDishPromiseState initialized to empty object
    expect(model.currentDishPromiseState).toBeTruthy();
    const dishId = 601651;
    model.currentDishId= dishId;        
    model.currentDishEffect()

    // currentDishPromiseState must have a property called promise
    expect(model.currentDishPromiseState.promise).toBeTruthy();

    // currentDishPromiseState must have a property called data which is initially null
    expect(model.currentDishPromiseState.data).toBeNull();

    // currentDishPromiseState must have a property called error which is initially null
    expect(model.currentDishPromiseState.error).toBeNull();

    // currentDishPromiseState must have a property called promise which is initially null
    expect(model.currentDishPromiseState.promise).toBeTruthy();

    await model.currentDishPromiseState.promise;

    //current data in currentDishPromiseState must have the property of id after a promise result
    expect(model.currentDishPromiseState.data).toBeTruthy();

    //  current data in currentDishPromiseState must have the correct dish id 
    expect(model.currentDishPromiseState.data.id).toEqual(dishId);
  });

  it("currentDishEffect does not initiate a promise when currentDishId is falsy", function tw2_2_3_3() {
    model.currentDishId=undefined;
    model.currentDishPromiseState={promise:"dummyPromise", data:"dummyData"};
    model.currentDishEffect()
    expect(model.currentDishPromiseState).toBeDefined();

    // currentDishPromiseState should get a falsy promise when currentDishId is falsy
    expect( model.currentDishPromiseState.promise).toBeFalsy();

    // currentDishPromiseState should get a falsy data and error when currentDishId is falsy
    expect(
        model.currentDishPromiseState.data ||
        model.currentDishPromiseState.error,
    ).toBeFalsy();
  });

  it("bootstrapping sets up a side effect for the current dish", async function(){
    // reaction() should have been called only once, with 2 parameters
    // because connectToPersistence is mocked
    expect(mobxReactionAcbs?.length).toEqual(2)
    let effectRan;
    const spy= jest.spyOn(reactiveModel, "currentDishEffect").mockImplementation(function(){
      effectRan= true;
    });

    reactiveModel.currentDishId=65535;
    await new Promise(x=>setTimeout(x));
    expect(effectRan).toEqual(true);
    spy.mockRestore();

    mobxReactionAcbs.forEach(checkCB)
  });  
})
