import { render, screen, within } from "@testing-library/react-native"
import { dishesConst } from "src/dishesConst"

import { dishType, menuPrice } from "../utilities"
import { SidebarView } from "../views/sidebarView"
import { SummaryView } from "../views/summaryView"

const { dishes1, dishes2, ingrList1, ingrList2 } = dishesConst

const summaryTestCases = [
  { people: 3, ingredients: ingrList1 },
  { people: 3, ingredients: ingrList1.slice(0).reverse() },
  { people: 2, ingredients: ingrList2 },
  { people: 2, ingredients: ingrList2.slice(0).reverse() },
] as const

const sidebarTestCases = [
  {
    number: 3,
    dishes: dishes1,
    onNumberChange: jest.fn(),
    onDishRemove: jest.fn(),
    onDishInterest: jest.fn(),
  },
  {
    number: 3,
    dishes: dishes1.slice(0).reverse(),
    onNumberChange: jest.fn(),
    onDishRemove: jest.fn(),
    onDishInterest: jest.fn(),
  },
  {
    number: 2,
    dishes: dishes2,
    onNumberChange: jest.fn(),
    onDishRemove: jest.fn(),
    onDishInterest: jest.fn(),
  },
  {
    number: 2,
    dishes: dishes2.slice(0).reverse(),
    onNumberChange: jest.fn(),
    onDishRemove: jest.fn(),
    onDishInterest: jest.fn(),
  },
]

describe("TW1.3 Array Rendering", () => {
  describe("SummaryView", () => {
    it("displays ingredients list with correct calculations", () => {
      summaryTestCases.forEach((props) => {
        render(<SummaryView {...props} />)

        const ingredientsList = screen.queryAllByTestId("summary-row")
        expect(ingredientsList).toHaveLength(props.ingredients.length)

        props.ingredients.forEach((ingr) => {
          const row = ingredientsList.find((row) => {
            const nameElement = within(row).queryByText(ingr.name)
            const aisleElement = within(row).queryByText(ingr.aisle)
            return nameElement && aisleElement
          })

          expect(row).toBeTruthy()

          expect(
            within(row).getByText(
              `${(ingr.amount * props.people).toFixed(2)} ${ingr.unit}`,
            ),
          ).toBeTruthy()
        })
      })
    })

    it("sorts ingredients by aisle and name", () => {
      summaryTestCases.forEach((props) => {
        render(<SummaryView {...props} />)

        const rows = screen.getAllByTestId("summary-row")

        rows.forEach((row, index) => {
          if (index === 0) return

          const currentAisle = row.findAllByType("Text")[1].props.children
          const prevAisle =
            rows[index - 1].findAllByType("Text")[1].props.children
          const currentName = row.findAllByType("Text")[0].props.children
          const prevName =
            rows[index - 1].findAllByType("Text")[0].props.children

          if (currentAisle === prevAisle) {
            expect(currentName > prevName).toBe(true)
          } else {
            expect(currentAisle > prevAisle).toBe(true)
          }
        })
      })
    })
  })

  describe("SidebarView", () => {
    it("displays dishes list with correct calculations", () => {
      sidebarTestCases.forEach((props) => {
        render(<SidebarView {...props} />)

        const dishesList = screen.queryAllByTestId("sidebar-row")
        expect(dishesList).toHaveLength(props.dishes.length)

        props.dishes.forEach((dish) => {
          const row = dishesList.find((row) => {
            const titleElement = within(row).queryByText(dish.title)
            const typeElement = within(row).queryByText(dishType(dish))
            return titleElement && typeElement
          })

          expect(row).toBeTruthy()

          expect(
            within(row).getByText(
              `$${((dish.pricePerServing / 100) * props.number).toFixed(2)}`,
            ),
          ).toBeTruthy()
        })

        const totalPrice = screen.getByText(
          `$${((menuPrice(props.dishes) / 100) * props.number).toFixed(2)}`,
        )
        expect(totalPrice).toBeTruthy()
      })
    })

    it("sorts dishes by type", () => {
      sidebarTestCases.forEach((props) => {
        render(<SidebarView {...props} />)

        const rows = screen.getAllByTestId("sidebar-row")

        rows.forEach((row, index) => {
          if (index === 0) return

          const current = props.dishes.find((dish) =>
            within(row).queryByText(dish.title),
          )
          const prev = props.dishes.find((dish) =>
            within(rows[index - 1]).queryByText(dish.title),
          )

          if (current && prev) {
            const currentType = dishType(current)
            const prevType = dishType(prev)

            expect(prevType.localeCompare(currentType)).toBeGreaterThanOrEqual(
              0,
            )
          }
        })
      })
    })
  })
})
