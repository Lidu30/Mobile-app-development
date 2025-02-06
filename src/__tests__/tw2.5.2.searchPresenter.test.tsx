import type { DinnerModel } from "src/DinnerModel"
import type { DishType, SearchDish, SearchResults } from "src/dishSource"
import { Image } from "expo-image"
import { router } from "expo-router"
import { render, screen } from "@testing-library/react-native"
import { Search } from "src/presenters/searchPresenter"
import { SearchFormView } from "src/views/searchFormView"
import { SearchResultsView } from "src/views/searchResultsView"
import { checkCB } from "./utils/checkCB"

jest.mock("src/views/searchFormView", () => ({
  SearchFormView: jest.fn(() => null),
}))

jest.mock("src/views/searchResultsView", () => ({
  SearchResultsView: jest.fn(() => null),
}))

jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(() => null),
}))

const mockSearchResults: SearchResults = {
  results: [
    {
      id: 1,
      title: "Test Dish",
      image: "test.jpg",
      sourceUrl: "http://test.com",
    },
  ],
  totalResults: 1,
  offset: 0,
  number: 1,
}

describe("TW2.5.2 Search Presenter", () => {
  let mockModel: Partial<DinnerModel>

  beforeEach(() => {
    jest.clearAllMocks()
    mockModel = {
      searchResultsPromiseState: {},
      searchParams: { query: "some test Query", type: "test Type" as DishType },
      doSearch: jest.fn(),
      setSearchQuery: jest.fn(),
      setSearchType: jest.fn(),
      setCurrentDishId: jest.fn(),
    }
  })

  it("handles custom events fired by SearchFormView", () => {
    render(<Search model={mockModel as DinnerModel} />)

    const searchFormProps = (SearchFormView as jest.Mock).mock.calls[0][0]

    // Test text change handler
    searchFormProps.onText("some test search query")
    expect(mockModel.setSearchQuery).toHaveBeenCalledWith(
      "some test search query",
    )
    checkCB( searchFormProps.onText)

    // Test type change handler
    searchFormProps.onType("some test search type")
    expect(mockModel.setSearchType).toHaveBeenCalledWith(
      "some test search type",
    )
    checkCB( searchFormProps.onType)	

    // Test search handler
    searchFormProps.onSearchDish()
    expect(mockModel.doSearch).toHaveBeenCalledWith(mockModel.searchParams)
    checkCB( searchFormProps.onSearchDish)		
  })

  it("handles dish selection from SearchResultsView", () => {
    mockModel.searchResultsPromiseState = {
      promise: Promise.resolve(mockSearchResults),
      data: mockSearchResults,
    }

    render(<Search model={mockModel as DinnerModel} />)

    const searchResultsProps = (SearchResultsView as jest.Mock).mock.calls[0][0]
    const testDish: SearchDish = {
      id: 42,
      title: "Test Dish",
      image: "test.jpg",
      sourceUrl: "http://test.com",
    }

    searchResultsProps.dishChosen(testDish)
    expect(mockModel.setCurrentDishId).toHaveBeenCalledWith(42)
    checkCB(searchResultsProps.dishChosen)
  })
})
