import { autorun } from "mobx"
import { reactiveModel } from "src/bootstrapping"

jest.mock("src/DinnerModel", () => ({
  model: { modelMarker: "testModel", currentDishId: null, numberOfGuests: 2, doSearch(){}},
}))

jest.mock("src/firestoreModel", () => ({
  connectToPersistence: jest.fn(() => null),
}))

describe("TW1.2.1 Bootstrapping", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Reactive model", () => {
    it("creates a reactive  DinnerModel", async () => {
      expect(reactiveModel.modelMarker).toBe("testModel") //  reactiveModel should use the model imported from DinnerModel
      let called
      autorun(function () {
        called = true
        return reactiveModel.numberOfGuests
      })
      called = false
      reactiveModel.numberOfGuests = 5
      await new Promise((resolve) => setTimeout(resolve))
      expect(called).toBe(true) // reactiveModel is indeed reactive: triggers a side effect when its content changes
    })
  })
})
