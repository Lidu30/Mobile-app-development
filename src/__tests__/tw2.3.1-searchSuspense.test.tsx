import { Text, View } from "react-native"
import { render, screen } from "@testing-library/react-native"
import { Search } from "src/presenters/searchPresenter"
import {SuspenseView} from "src/views/suspenseView";
import {SearchFormView} from "src/views/searchFormView";
import {SearchResultsView} from "src/views/searchResultsView";
import {observable, autorun, configure} from "mobx"
import {observer} from "mobx-react-lite"
import {act} from "react"

configure({ enforceActions: "never" })

jest.mock("src/firestoreModel", () => ({
  connectToPersistence: jest.fn(() => null),
}))

import { mockModel, resetMockModel } from "./mocks/mockModel"

import {reactiveModel} from "src/bootstrapping"

describe("TW2.3.1 Search presenter: checking stubs", () => {
  it("Search presenter exists (create stub, render it in index.jsx!)", ()=>{
     expect(Search).toBeTruthy();
  })
   it("SearchFormView and SearchResultsView exist (create stubs)", ()=>{
     expect(typeof SearchFormView).toBe("function");
     expect(typeof SearchResultsView).toBe("function");
  })
})

jest.mock("src/firestoreModel", () => ({
  connectToPersistence: jest.fn(() => null),
}))

jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(() => null),
}))

jest.mock("src/views/searchResultsView", () => ({
  SearchResultsView: jest.fn(() => null),
}))

jest.mock("src/views/searchFormView", () => ({
  SearchFormView: jest.fn(() => null),
}))

jest.mock("src/DinnerModel", () => ({
    model: {
      doSearchCalledWith:"initialParam",
      doSearch(x){ this.doSearchCalledWith=x;}
    }
}))

describe("TW2.3.1 Search presenter suspense", () => {
  afterEach(() => {
    jest.clearAllMocks()
    resetMockModel()
  })


  // split this into Details and Search

  it("Search presenter determines when to render SuspenseView or SearchResultsView", () => {
    const testCases = [
      { guests: 2, dishes: [], searchResultsPromiseState:{}, expectedRender: SuspenseView},
      { guests: 5, dishes: [], searchResultsPromiseState:{promise:"dummyPromise"}, expectedRender: SuspenseView},
      { guests: 7, dishes: [], searchResultsPromiseState:{promise:"dummyPromise", data:"dummyData"}, expectedRender: SearchResultsView}, 
      { guests: 7, dishes: [], searchResultsPromiseState:{promise:"dummyPromise", error:"dummyError"},expectedRender: SuspenseView},
    ] as const
    
    testCases.forEach(({ searchResultsPromiseState, expectedRender }) => {
      jest.clearAllMocks();
      const model = {
        ...mockModel,
        searchResultsPromiseState
      }
      render(<Search model={model} />)
      expect(SearchFormView).toHaveBeenCalled();
      expect(expectedRender).toHaveBeenCalled();
      if(expectedRender===SuspenseView)
        expect(SearchResultsView).not.toHaveBeenCalled();
      else
        expect(SuspenseView).not.toHaveBeenCalled();

    })
  })

  it("Search presenter is an observer", async ()=>{
       jest.clearAllMocks();

    const reactiveModel= observable({
    	  ...mockModel,
	  searchResultsPromiseState:{promise:"testPromise"}
    })
    const scr=    render(<Search model={reactiveModel} />)

    expect(SuspenseView).toHaveBeenCalled();
    expect(SearchResultsView).not.toHaveBeenCalled();	

    SuspenseView.mockClear();
    act(()=> reactiveModel.searchResultsPromiseState.data="dummyData")
    expect(SearchResultsView).toHaveBeenCalled();
    expect(SuspenseView).not.toHaveBeenCalled();
  })

  it("bootstrapping performs an initial search", function(){
    expect(reactiveModel.doSearchCalledWith).toEqual({})
  });  
})
