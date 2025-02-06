import { dishesConst } from "src/dishesConst"

import { compareDishesCB, sortDishes } from "../utilities"

describe("TW1.1.4 sort(CB) recap exercise: sortDishes", () => {
  describe("compareDishesCB", () => {
    it("handles dishes with no known type vs starter", () => {
      expect(compareDishesCB(dishesConst[0], dishesConst[1])).toBe(-1)
      expect(compareDishesCB(dishesConst[1], dishesConst[0])).toBe(1)
    })

    it("handles starter vs main course", () => {
      expect(compareDishesCB(dishesConst[1], dishesConst[4])).toBe(-1)
      expect(compareDishesCB(dishesConst[4], dishesConst[1])).toBe(1)
    })

    it("handles main course vs dessert", () => {
      expect(compareDishesCB(dishesConst[4], dishesConst[6])).toBe(-1)
      expect(compareDishesCB(dishesConst[6], dishesConst[4])).toBe(1)
    })

    it("returns zero for dishes of same type", () => {
      expect(compareDishesCB(dishesConst[0], dishesConst[7])).toBe(0)
      expect(compareDishesCB(dishesConst[1], dishesConst[2])).toBe(0)
      expect(compareDishesCB(dishesConst[4], dishesConst[4])).toBe(0)
      expect(compareDishesCB(dishesConst[6], dishesConst[6])).toBe(0)
    })
  })

  describe("sortDishes", () => {
    it("sorts in order: 'no known type', starter, main course, dessert", () => {
      const array = [
        dishesConst[4],
        dishesConst[6],
        dishesConst[1],
        dishesConst[2],
        dishesConst[7],
      ]
      const sorted = sortDishes(array)

      expect(sorted).toHaveLength(5)
      expect(sorted[0]).toBe(array[4]) // no type
      expect(sorted[1]).toBe(array[2]) // starter1
      expect(sorted[2]).toBe(array[3]) // starter2
      expect(sorted[3]).toBe(array[0]) // main course
      expect(sorted[4]).toBe(array[1]) // dessert

      // Additional test cases
      const array1 = [
        dishesConst[5],
        dishesConst[4],
        dishesConst[1],
        dishesConst[0],
      ]
      const sorted1 = sortDishes(array1)

      expect(sorted1).toHaveLength(4)
      expect(sorted1[0]).toBe(dishesConst[0]) // no type
      expect(sorted1[1]).toBe(dishesConst[1]) // starter
      expect(sorted1[2]).toBe(dishesConst[4]) // main course
      expect(sorted1[3]).toBe(dishesConst[5]) // dessert
    })

    it("returns a new array and does not modify the original", () => {
      const array = [
        dishesConst[4],
        dishesConst[6],
        dishesConst[2],
        dishesConst[7],
      ]
      const arrayCopy = [...array]
      const sorted = sortDishes(array)

      expect(sorted).not.toBe(array)
      expect(array).toEqual(arrayCopy)
    })
  })
})
