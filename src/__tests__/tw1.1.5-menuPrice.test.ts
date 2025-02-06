import type { Dish } from "src/dishSource"
import { dishesConst } from "src/dishesConst"

import { menuPrice } from "../utilities"

describe("TW1.1.5 reduce(CB, acc) exercise: menuPrice", () => {
  it("should sum up dish prices", () => {
    const dishes = [
      dishesConst[4],
      dishesConst[6],
      dishesConst[2],
      dishesConst[7],
    ]

    expect(menuPrice(dishes)).toBe(
      dishesConst[4].pricePerServing +
        dishesConst[6].pricePerServing +
        dishesConst[2].pricePerServing +
        dishesConst[7].pricePerServing,
    )
  })

  it("for empty menu, should return 0", () => {
    const dishes: Dish[] = []
    expect(menuPrice(dishes)).toBe(0)
  })
})
