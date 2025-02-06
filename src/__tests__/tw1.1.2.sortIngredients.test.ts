import type { Ingredient } from "src/dishSource"

import { compareIngredientsCB, sortIngredients } from "../utilities"

const ingredientsConst = [
  { aisle: "Produce", name: "pumpkin", id: 1, amount: 1, unit: "kg" },
  { aisle: "Frozen", name: "icecream", id: 2, amount: 1, unit: "kg" },
  { aisle: "Produce", name: "apricot", id: 3, amount: 1, unit: "kg" },
  { aisle: "Frozen", name: "frozen broccoli", id: 4, amount: 1, unit: "kg" },
] as const satisfies Ingredient[]

const ingredientConst2 = [
  {
    name: "Italian seasoning",
    aisle: "Spices",
    amount: 0.5,
    unit: "g",
    id: 1119,
  },
  { name: "garlic salt", aisle: "Spices", amount: 0.5, unit: "g", id: 1118 },
] as const satisfies Ingredient[]

describe("TW1.1.2 sort(CB) exercise: sortIngredients", () => {
  test("compareIngredientsCB compares by aisle, then by name", () => {
    expect(
      compareIngredientsCB(ingredientsConst[2], ingredientsConst[1]),
    ).toBeGreaterThan(0)
    expect(
      compareIngredientsCB(ingredientsConst[1], ingredientsConst[2]),
    ).toBeLessThan(0)
    expect(
      compareIngredientsCB(ingredientsConst[0], ingredientsConst[2]),
    ).toBeGreaterThan(0)
    expect(
      compareIngredientsCB(ingredientsConst[2], ingredientsConst[0]),
    ).toBeLessThan(0)

    expect(
      compareIngredientsCB(
        {
          name: "milk",
          aisle: "dairy",
          id: 0,
          amount: 0,
          unit: "",
        },
        {
          name: "milk",
          aisle: "Dairy",
          id: 0,
          amount: 0,
          unit: "",
        },
      ),
    ).toBeGreaterThan(0)

    expect(
      compareIngredientsCB(
        {
          name: "Egg",
          aisle: "mock",
          id: 0,
          amount: 0,
          unit: "",
        },
        {
          name: "eggs",
          aisle: "mock",
          id: 0,
          amount: 0,
          unit: "",
        },
      ),
    ).toBeLessThan(0)
  })

  test("should sort by aisle first, then by name", () => {
    const ingredients = [...ingredientsConst]
    const sorted = sortIngredients(ingredients)

    expect(Array.isArray(sorted)).toBe(true)
    expect(sorted).toHaveLength(ingredientsConst.length)
    expect(sorted[0]).toBe(ingredientsConst[3])
    expect(sorted[1]).toBe(ingredientsConst[1])
    expect(sorted[2]).toBe(ingredientsConst[2])
    expect(sorted[3]).toBe(ingredientsConst[0])

    const ingr2 = [...ingredientConst2]
    const sorted2 = sortIngredients(ingr2)
    expect(sorted2[0]).toBe(ingr2[0])
  })

  test("sorted array should not be the same object as original array", () => {
    const ingredients = [...ingredientsConst]
    const sorted = sortIngredients(ingredients)

    expect(Array.isArray(sorted)).toBe(true)
    expect(sorted).toHaveLength(ingredients.length)
    expect(sorted).not.toBe(ingredients)
    ingredients.forEach((ingredient, index) => {
      expect(ingredient).toBe(ingredientsConst[index])
    })
  })
})
