import type { DinnerModel } from "src/DinnerModel"
import { model } from "src/DinnerModel"
import { dishesConst } from "src/dishesConst"

import cloneModel from "./utils/cloneModel"

function getDishConst(x: number) {
  return dishesConst.find((d) => d.id === x)
}

describe("TW1.1.1 Basic JavaScript", () => {
  let testModel: DinnerModel

  beforeEach(() => {
    testModel = cloneModel(model)
  })

  it("can set current dish", () => {
    expect(testModel.currentDishId).toBeNull()

    const oldFetch = global.fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(dishesConst[0]),
      }),
    )

    try {
      testModel.setCurrentDishId(1)
      expect(testModel.currentDishId).toBe(1)

      testModel.setCurrentDishId(3)
      expect(testModel.currentDishId).toBe(3)
    } finally {
      global.fetch = oldFetch
    }
  })

  it("number of guests can only be set to a positive integer", () => {
    expect(testModel).toBeDefined()
    expect(testModel.numberOfGuests).toBe(2)
    expect(testModel.dishes).toEqual([])
    expect(testModel.dishes.length).toBe(0)

    testModel.setNumberOfGuests(1)
    expect(testModel.numberOfGuests).toBe(1)

    testModel.setNumberOfGuests(2)
    expect(testModel.numberOfGuests).toBe(2)

    const msg = "number of guests not a positive integer"

    expect(() => testModel.setNumberOfGuests(-1)).toThrow(msg)
    expect(() => testModel.setNumberOfGuests(0)).toThrow(msg)
    expect(() => testModel.setNumberOfGuests(3.14159265)).toThrow(msg)
  })

  it("can add dishes", () => {
    testModel.addToMenu(getDishConst(100)!)
    expect(testModel.dishes.length).toBe(1)

    testModel.addToMenu(getDishConst(1)!)
    expect(testModel.dishes.length).toBe(2)

    testModel.addToMenu(getDishConst(200)!)
    expect(testModel.dishes.length).toBe(3)

    expect(testModel.dishes).toContainEqual(getDishConst(1))
    expect(testModel.dishes).toContainEqual(getDishConst(100))
    expect(testModel.dishes).toContainEqual(getDishConst(200))
  })
})
