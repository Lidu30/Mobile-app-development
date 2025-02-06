import type { DinnerModel } from "src/DinnerModel"
import type { Dish } from "src/dishSource"
import { Image } from "expo-image"
import { render, screen } from "@testing-library/react-native"
import { Details } from "src/presenters/detailsPresenter"
import { DetailsView } from "src/views/detailsView"
import { SuspenseView } from "src/views/suspenseView"

import {dishesConst} from "src/dishesConst"
import { mockModel, resetMockModel } from "./mocks/mockModel"


// Mock the SuspenseView component
jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(x => "mock suspense view"),
}))

// Mock the DetailsView component
jest.mock("src/views/detailsView", () => ({
  DetailsView: jest.fn(() => "mock details view"),
}))

function falsy(x){
  return {pass: x===undefined|| x===null || x===false}
}

function truthy(x){
  return {pass: x!==undefined &&  x!==null && x!==false}
}

expect.extend({truthy, falsy})

describe("TW2.3.2 Details Presenter passes correct props", () => {
  const testDish = dishesConst[0] // French toast dish

  beforeEach(() => {
    resetMockModel()
  })


  it("Details presenter sends promise and error to the SuspenseView", () => {
    const testCases = [
      { currentDishPromiseState:{}, expectedRender: SuspenseView, param:{}},
      { currentDishId:42, currentDishPromiseState:{promise:"dummyPromise"}, expectedRender: SuspenseView,param:{promise:"dummyPromise"}},
      { currentDishId:42, currentDishPromiseState:{promise:"dummyPromise", data:"dummyData"}, expectedRender: DetailsView}, 
      { currentDishId:42, currentDishPromiseState:{promise:"dummyPromise", error:"dummyError"},expectedRender: SuspenseView, param:{promise:"dummyPromise", error:"dummyError"}},
    ] as const
    

    testCases.forEach(({ currentDishPromiseState, expectedRender, param }) => {
      SuspenseView.mockClear();
      const model = {
        ...mockModel,
        currentDishPromiseState,
      }
      render(<Details model={model} />)
      if(expectedRender!==SuspenseView)
        expect(SuspenseView).not.toHaveBeenCalled();
      else
        // react actually passes two parameters to components, hence the anything!
        expect(SuspenseView).toHaveBeenCalledWith(expect.objectContaining(param), expect.anything())
    });
  });

  it("renders DetailsView with correct props when dish data exists", () => {
    const testCases = [
      { numberOfGuests: 4, dishes: [], currentDishId:testDish.id, currentDishPromiseState:{data:testDish}, expectedRender: DetailsView,
        param:{guests:4, isDishInMenu:expect.falsy(), dishData: expect.objectContaining({id:testDish.id})}
      },
      { numberOfGuests: 4, dishes: [{id:42}], currentDishId:testDish.id, currentDishPromiseState:{data:testDish}, expectedRender: DetailsView,
        param:{guests:4, isDishInMenu:expect.falsy(), dishData: expect.objectContaining({id:testDish.id})}
      },
      { numberOfGuests: 5, dishes: [{id:40}, testDish, {id:42}],  currentDishId:testDish.id, currentDishPromiseState:{data:testDish}, expectedRender: DetailsView,
        param:{guests:5, isDishInMenu:expect.truthy(), dishData: expect.objectContaining({id:testDish.id})}
      },

    ] as const
    

    testCases.forEach(({ numberOfGuests, currentDishId, dishes, currentDishPromiseState, expectedRender, param }) => {
      DetailsView.mockClear();
      const model = {
        ...mockModel,
        numberOfGuests,
        currentDishId,
        dishes,
        currentDishPromiseState,
      }
      render(<Details model={model} />)
      if(expectedRender!==DetailsView)
        expect(DetailsView).not.toHaveBeenCalled();
      else{
        expect(DetailsView).toHaveBeenCalledWith(expect.objectContaining({dishData:param.dishData}),  expect.anything())
        expect(DetailsView).toHaveBeenCalledWith(expect.objectContaining({guests:param.guests}),  expect.anything())
        expect(DetailsView).toHaveBeenCalledWith(expect.objectContaining({isDishInMenu:param.isDishInMenu}),  expect.anything())
      }
    });
  });
})
