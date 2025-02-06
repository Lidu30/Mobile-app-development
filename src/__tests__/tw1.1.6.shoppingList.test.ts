import type { Dish, Ingredient } from "../dishSource"
import { shoppingList } from "../utilities"

const dishes: Partial<Dish>[] = [
  {
    extendedIngredients: [
      { aisle: "Produce", name: "pumpkin", id: 12, amount: 3.5 },
      { aisle: "Frozen", name: "frozen broccoli", id: 14, amount: 10 },
    ] as Ingredient[],
  },
  {
    extendedIngredients: [
      { aisle: "Produce", name: "pumpkin", id: 12, amount: 10 },
      { aisle: "Produce", name: "parsley", id: 13, amount: 21 },
    ] as Ingredient[],
  },
  {
    extendedIngredients: [
      { aisle: "Produce", name: "parsley", id: 13, amount: 42 },
    ] as Ingredient[],
  },
]

describe("TW1.1.6 reduce(CB, acc) example: shoppingList", () => {
  it("should add up ingredient amounts", () => {
    const result = shoppingList(dishes as Dish[])

    expect(result).toHaveLength(3)

    const pumpkin = result.filter((i) => i.id === 12)
    expect(pumpkin).toHaveLength(1)
    expect(pumpkin[0]?.amount).toBe(13.5)

    const parsley = result.filter((i) => i.id === 13)
    expect(parsley).toHaveLength(1)
    expect(parsley[0]?.amount).toBe(63)

    const broccoli = result.filter((i) => i.id === 14)
    expect(broccoli).toHaveLength(1)
    expect(broccoli[0]?.amount).toBe(10)
  })
})
