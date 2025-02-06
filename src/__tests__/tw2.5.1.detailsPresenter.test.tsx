import type { DinnerModel } from "src/DinnerModel"
import type { Dish } from "src/dishSource"
import { Image } from "expo-image"
import { render, screen } from "@testing-library/react-native"
import { Details } from "src/presenters/detailsPresenter"
import { DetailsView } from "src/views/detailsView"
import { checkCB } from "./utils/checkCB"

import {dishesConst} from "src/dishesConst"

// Mock the DetailsView component
jest.mock("src/views/detailsView", () => ({
  DetailsView: jest.fn(() => "mock details view"),
}))


jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(() => null),
}))
const mockDetailsView = DetailsView as jest.MockedFunction<typeof DetailsView>

describe("TW2.5.1 Details Presenter", () => {
  const testDish = dishesConst[0] // French toast dish

  beforeEach(() => {
    mockDetailsView.mockClear()
  })

  it("handles adding dish to menu", () => {
    let addedDish: Dish | undefined

    const model: Partial<DinnerModel> = {
      currentDishPromiseState: {
        data: testDish,
      },
      currentDishId: testDish.id,
      dishes: [testDish],
      numberOfGuests: 5,
      addToMenu: (dish: Dish) => {
        addedDish = dish
      },
      searchResultsPromiseState: {},
    }

    render(<Details model={model as DinnerModel} />)

    // Get the last call to DetailsView and extract the addToMenu prop
    const calls = mockDetailsView.mock.calls
    if (calls.length === 0) {
      throw new Error("Expected DetailsView to have been called")
    }
    const lastCall = calls[calls.length - 1]![0]
    const addToMenuHandler = lastCall.userWantsToAddDish

    expect(typeof addToMenuHandler).toBe("function")
    expect(addToMenuHandler.length).toBe(0)

    addToMenuHandler()
    expect(addedDish).toEqual(testDish)

    checkCB(addToMenuHandler)
})
})
