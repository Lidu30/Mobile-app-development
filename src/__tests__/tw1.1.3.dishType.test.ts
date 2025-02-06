import { dishesConst } from "src/dishesConst"

import { model as modelTemplate } from "../DinnerModel"
import { dishType, isKnownTypeCB } from "../utilities"
import cloneModel from "./utils/cloneModel"

function getDishConst(x: number): (typeof dishesConst)[number] | undefined {
  return dishesConst.find((d) => d.id === x)
}

describe("TW1.1.3 filter(CB) exercises: dishType and removeFromMenu", () => {
  let model = cloneModel(modelTemplate)

  beforeEach(() => {
    model = cloneModel(modelTemplate)
  })

  test("isKnownTypeCB recognizes only starter, main course, dessert", () => {
    expect(isKnownTypeCB("starter")).toBeTruthy()
    expect(isKnownTypeCB("main course")).toBeTruthy()
    expect(isKnownTypeCB("dessert")).toBeTruthy()
    expect(isKnownTypeCB("appetizer")).toBeFalsy()
  })

  test("dishType returns a known dish type", () => {
    const dish = dishesConst[4]
    expect(dishType(dish)).toBe("main course")
  })

  test("dishType returns empty string if starter, main course, dessert not present", () => {
    expect(dishType(dishesConst[0])).toBe("")
  })

  test("dishType returns empty string if dishTypes property not present", () => {
    expect(dishType(dishesConst[7])).toBe("")
  })

  test("can remove dishes", () => {
    // Force a few dishes in the menu, then try to remove one
    const dish100 = getDishConst(100)
    const dish1 = getDishConst(1)
    const dish200 = getDishConst(200)

    model.dishes = [dish100, dish1, dish200].filter((d) => d !== undefined)
    model.removeFromMenu({
      id: 1,
      title: "",
      pricePerServing: 0,
      summary: "",
      extendedIngredients: [],
    })

    expect(model.dishes).toHaveLength(2)
    expect(model.dishes).not.toContainEqual(dish1)
    expect(model.dishes).toContainEqual(dish100)
    expect(model.dishes).toContainEqual(dish200)

    // Remove non-existing dish
    model.removeFromMenu({
      id: 256,
      title: "",
      pricePerServing: 0,
      summary: "",
      extendedIngredients: [],
    })
    expect(model.dishes).toHaveLength(2)
    expect(model.dishes).toContainEqual(dish100)
    expect(model.dishes).toContainEqual(dish200)
  })
})
