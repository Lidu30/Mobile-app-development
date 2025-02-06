import type { DinnerModel } from "src/DinnerModel"
import type { Dish } from "src/dishSource"
import { Image } from "expo-image"
import { render, screen } from "@testing-library/react-native"
import { Search } from "src/presenters/searchPresenter"
import { SearchFormView } from "src/views/searchFormView"
import { SearchResultsView } from "src/views/searchResultsView"
import { SuspenseView } from "src/views/suspenseView"

import {dishesConst} from "src/dishesConst"
import { mockModel, resetMockModel } from "./mocks/mockModel"


// Mock the SuspenseView component
jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(x => {calledWith={...x}; return "mock suspense view"}),
}))

// Mock the SearchFormView component
jest.mock("src/views/searchFormView", () => ({
  SearchFormView: jest.fn(() => "mock search form"),
}))

// Mock the SearchResultsView component
jest.mock("src/views/searchResultsView", () => ({
  SearchResultsView: jest.fn(() => "mock results form"),
}))

describe("TW2.3.2 Search Presenter passes correct props", () => {
  beforeEach(() => {
    resetMockModel()
  })

  it("Passes text, type and dishTypeOptions props to SearchFormView", () => {
    const testCases = [
      {
        searchParams:{query:"dummy text", type:"dummy type"},
        form:{text:"dummy text", type:"dummy type", dishTypeOptions: ["starter", "main course", "dessert"]}
      },
      {
        searchParams:{query:"dummy text1", type:"dummy type1"},
        form:{text:"dummy text1", type:"dummy type1", dishTypeOptions: ["starter", "main course", "dessert"]}
      },
      {
        searchParams:{query:"dummy text2", type:"dummy type2"},
        form:{text:"dummy text2", type:"dummy type2", dishTypeOptions: ["starter", "main course", "dessert"]}
      }, 
      {
        searchParams:{query:"dummy text3", type:"dummy type3"},
        form:{text:"dummy text3", type:"dummy type3", dishTypeOptions: ["starter", "main course", "dessert"]}
      },
    ] as const
    

    testCases.forEach(({ searchParams, form}) => {
      SearchFormView.mockClear();
      
      const model = {
        ...mockModel,
        searchParams
      }
      render(<Search model={model} />)
      // react actually passes two parameters to components, hence the anything!
      expect(SearchFormView).toHaveBeenCalledWith(expect.objectContaining(form), expect.anything())
    });
  });

  it("Search presenter sends promise and error to the SuspenseView", () => {
    const testCases = [
      {
        searchResultsPromiseState:{},
        expectedRender: SuspenseView,
        param:{}
      },
      {
        searchResultsPromiseState:{promise:"dummyPromise"},
        expectedRender: SuspenseView,
        param:{promise:"dummyPromise"}
      },
      {
        searchResultsPromiseState:{promise:"dummyPromise", data:"dummyData"},
        expectedRender: SearchResultsView
      }, 
      {
        searchResultsPromiseState:{promise:"dummyPromise", error:"dummyError"},
        expectedRender: SuspenseView,
        param:{promise:"dummyPromise", error:"dummyError"}
      },
    ] as const
    

    testCases.forEach(({ searchResultsPromiseState, expectedRender, param}) => {
      SuspenseView.mockClear();
      
      const model = {
        ...mockModel,
        searchResultsPromiseState,
      }
      render(<Search model={model} />)
      // react actually passes two parameters to components, hence the anything!
      if(expectedRender!==SuspenseView)
        expect(SuspenseView).not.toHaveBeenCalled();
      else
        // react actually passes two parameters to components, hence the anything!
        expect(SuspenseView).toHaveBeenCalledWith(expect.objectContaining(param), expect.anything())
    });
  });
       
  it("Renders SearchResultsView with correct props when dish data exists", () => {
    const testCases = [
      {
        searchParams:{query:"dummy text", type:"dummy type"},
        searchResultsPromiseState:{promise:"dummyPromise", data:[{id:21}, {id:41}]},
        expectedRender: SearchResultsView, param:{searchResults:expect.arrayContaining([{id:21}, {id:41}])},
        form:{text:"dummy text", type:"dummy type", dishTypeOptions: ["starter", "main course", "dessert"]}
      },
      {
        searchParams:{query:"dummy text1", type:"dummy type1"},
        searchResultsPromiseState:{promise:"dummyPromise", data:[{id:20}, {id:42}]},
        expectedRender: SearchResultsView ,
        param:{searchResults:expect.arrayContaining([{id:20}, {id:42}])},
        form:{text:"dummy text1", type:"dummy type1", dishTypeOptions: ["starter", "main course", "dessert"]}
      },
      
    ] as const
    
    
    testCases.forEach(({ searchResultsPromiseState, searchParams, expectedRender, form, param }) => {
      SearchFormView.mockClear();
      SearchResultsView.mockClear();
      
      const model = {
        ...mockModel,
        searchParams,
        searchResultsPromiseState,
      }
      render(<Search model={model} />)
      
      expect(SearchFormView).toHaveBeenCalledWith(expect.objectContaining(form), expect.anything())
      if(expectedRender!==SearchResultsView)
        expect(SearchResults).not.toHaveBeenCalled();
      else
        expect(SearchResultsView).toHaveBeenCalledWith(expect.objectContaining(param), expect.anything())
    });
  })
})
