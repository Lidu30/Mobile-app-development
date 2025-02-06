import {dishesConst} from "src/dishesConst"
import {model} from "src/DinnerModel"
import {observable} from "mobx"

const mockSearchResults: SearchResults = {
  results: dishesConst.slice(0, 3).map((dish) => ({
    id: dish.id,
    title: dish.title,
    image: dish.image || "",
    sourceUrl: dish.sourceUrl || "",
  })),
  totalResults: 3,
  offset: 0,
  number: 3,
}

// Create mock module factory with direct values
jest.mock("src/dishSource", () => ({
  searchDishes: jest.fn(() => Promise.resolve(mockSearchResults)),
}))

describe("TW2.2.2 Promise State in Model: search", () => {

  it("Model has searchParams", () => {
    expect(model.searchParams).toBeDefined()
    expect(model.searchParams).toEqual({})
  })

  it("setSearchQuery and setSearchType save their arguments in searchParams", () => {
    model.setSearchQuery("pizza")
    model.setSearchType("main course")

    expect(model.searchParams).toHaveProperty("query", "pizza")
    expect(model.searchParams).toHaveProperty("type", "main course")
  })

  it("Model defines property searchResultsPromiseState", () => {
    expect(model.searchResultsPromiseState).toBeDefined()
    expect(model.searchResultsPromiseState).toEqual({})
  })

  it("doSearch performs a search with the given params and resolves the promise into searchResultsPromiseState", async () => {
    const searchParams = { query: "ice cream", type: "dessert" as const }
    model.doSearch(searchParams)

    expect(model.searchResultsPromiseState).toHaveProperty("promise")
    expect(model.searchResultsPromiseState.data).toBeNull()
    expect(model.searchResultsPromiseState.error).toBeNull()
    expect(model.searchResultsPromiseState.promise).toBeDefined()

    await model.searchResultsPromiseState.promise
    expect(model.searchResultsPromiseState.data).toEqual(mockSearchResults)
  })

  // unclear what is the point of this test, in both Web and Native
  it("doSearch works when used in a reactive model", async () => {
    const reactiveModel = observable(model);

    const searchParams = { query: "ice cream", type: "dessert" as const }
    reactiveModel.doSearch(searchParams)

    expect(reactiveModel.searchResultsPromiseState).toHaveProperty("promise")
    expect(reactiveModel.searchResultsPromiseState.data).toBeNull()
    expect(reactiveModel.searchResultsPromiseState.error).toBeNull()
    expect(reactiveModel.searchResultsPromiseState.promise).toBeDefined()

    await reactiveModel.searchResultsPromiseState.promise
    expect(reactiveModel.searchResultsPromiseState.data).toEqual(
      mockSearchResults,
    )
  })
})
