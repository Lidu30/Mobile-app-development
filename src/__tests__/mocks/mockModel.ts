import type { DinnerModel } from "src/DinnerModel"

const dummyMethod = (methodName: string) => () => {
  throw new Error(
    `unexpected Model method invocation of ${methodName}. Check your stacktrace! A presenter is only expected to call certain methods of the model`,
  )
}

export const mockModel = jest.mocked<DinnerModel>({
  numberOfGuests: 2,
  dishes: [],
  currentDishId: null,
  searchParams: {},
  searchResultsPromiseState: {},
  currentDishPromiseState: {},
  setNumberOfGuests: jest.fn(dummyMethod("setNumberOfGuests")),
  addToMenu: jest.fn(dummyMethod("addToMenu")),
  removeFromMenu: jest.fn(dummyMethod("removeFromMenu")),
  setCurrentDishId: jest.fn(dummyMethod("setCurrentDishId")),
  setSearchQuery: jest.fn(dummyMethod("setSearchQuery")),
  setSearchType: jest.fn(dummyMethod("setSearchType")),
  doSearch: jest.fn(dummyMethod("doSearch")),
})

export const resetMockModel = () => {
  jest.clearAllMocks()
  Object.assign(mockModel, {
    numberOfGuests: 2,
    dishes: [],
    currentDishId: null,
    searchParams: {
      query: undefined,
      type: undefined,
    },
    searchResultsPromiseState: {
      data: undefined,
      error: undefined,
      promise: undefined,
    },
    currentDishPromiseState: {
      data: undefined,
      error: undefined,
      promise: undefined,
    },
  })
}
