import { Text, View } from "react-native"
import { render, screen } from "@testing-library/react-native"
import { Details } from "src/presenters/detailsPresenter"
import {SuspenseView} from "src/views/suspenseView";
import {DetailsView} from "src/views/detailsView";
import {observable, autorun, configure} from "mobx"
import {observer} from "mobx-react-lite"
import {act} from "react"

configure({ enforceActions: "never" })

import { mockModel, resetMockModel } from "./mocks/mockModel"

describe("TW2.3.1 Details presenter: checking  stubs", () => {
  it("Details presenter exists (create stub, render it in index.jsx!)", ()=>{
     // observer returns an object so we're not looking for a function
     expect(Details).toBeTruthy()
  })
  it("SuspenseView and DetailsView exist (create stubs)", ()=>{
     expect(typeof SuspenseView).toBe("function");
     expect(typeof DetailsView).toBe("function");
  })
})  


jest.mock("src/views/suspenseView", () => ({
  SuspenseView: jest.fn(() => "suspense"),
}))

jest.mock("src/views/detailsView", () => ({
  DetailsView: jest.fn(() => "details"),
}))

describe("TW2.3.1 Details presenter suspense", () => {
  afterEach(() => {
    jest.clearAllMocks()
    resetMockModel()
  })


  it("Details presenter determines when to render SuspenseView or DetailsView", () => {
    const testCases = [
      { guests: 2, dishes: [], currentDishPromiseState:{}, expectedRender: SuspenseView},
      { guests: 5, dishes: [], currentDishPromiseState:{promise:"dummyPromise"}, expectedRender: SuspenseView},
      { guests: 7, dishes: [], currentDishPromiseState:{promise:"dummyPromise", data:"dummyData"}, expectedRender: DetailsView}, 
      { guests: 7, dishes: [], currentDishPromiseState:{promise:"dummyPromise", error:"dummyError"},expectedRender: SuspenseView},
    ] as const
    
    testCases.forEach(({ currentDishPromiseState, expectedRender }) => {
      jest.clearAllMocks();
      const model = {
        ...mockModel,
        currentDishPromiseState
      }
      render(<Details model={model} />)
      expect(expectedRender).toHaveBeenCalled();
      if(expectedRender===SuspenseView)
        expect(DetailsView).not.toHaveBeenCalled();
      else
        expect(SuspenseView).not.toHaveBeenCalled();

    })
       })
       
   it("Details presenter is an observer", async ()=>{
       jest.clearAllMocks();

    const reactiveModel= observable({
    	  ...mockModel,
	  currentDishPromiseState:{promise:"testPromise"}
    })
    const scr=    render(<Details model={reactiveModel} />)

    expect(SuspenseView).toHaveBeenCalled();
    expect(DetailsView).not.toHaveBeenCalled();	

    SuspenseView.mockClear();
    act(()=> reactiveModel.currentDishPromiseState.data="dummyData")
    expect(DetailsView).toHaveBeenCalled();
    expect(SuspenseView).not.toHaveBeenCalled();
  })


})
