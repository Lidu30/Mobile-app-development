import type { Dish } from "src/dishSource"
import { render, screen } from "@testing-library/react-native"
import { SidebarView } from "src/views/sidebarView"
import { SummaryView } from "src/views/summaryView"

const mockDishes = [] satisfies Dish[]

describe("TW1.2.3 Basic Rendering", () => {
  describe("SummaryView", () => {
    it("shows the number of people", () => {
      const testCases = [
        { people: 4, ingredients: [] },
        { people: 2, ingredients: [] },
      ]

      testCases.forEach(({ people, ingredients }) => {
        render(<SummaryView people={people} ingredients={ingredients} />)

        // Test if the number of people is displayed
        const expectedText = `${people} ${people === 1 ? "person" : "persons"}`
        expect(screen.getByText(expectedText, { exact: false })).toBeTruthy()
      })
    })
  })

  describe("SidebarView", () => {
    const defaultProps = {
      onNumberChange: jest.fn(),
      onDishRemove: jest.fn(),
      onDishInterest: jest.fn(),
      dishes: mockDishes,
    }

    it("shows its number prop and has working pressables", () => {
      const testCases = [
        { number: 4, expected: "4 Guests" },
        { number: 7, expected: "7 Guests" },
      ]

      testCases.forEach(({ number, expected }) => {
        render(<SidebarView {...defaultProps} number={number} />)

        // Check guest count display
        expect(screen.getByText(expected)).toBeTruthy()

        // Check counter pressables
        const buttons = screen.getAllByRole("button")
        const counterButtons = buttons.slice(0, 2) // First two are the counter buttons

        // Check button text content
        expect(counterButtons[0]).toHaveTextContent("-")
        expect(counterButtons[1]).toHaveTextContent("+")

        // Check button state
        expect(counterButtons[0].props.disabled).toBeFalsy()
      })
    })

    it("disables minus button when number is 1", () => {
      const testCases = [
        { number: 5, expectedDisabled: false },
        { number: 1, expectedDisabled: true },
      ] as const

      testCases.forEach(({ number, expectedDisabled }) => {
        render(<SidebarView {...defaultProps} number={number} />)

        const expected = `${number} ${number === 1 ? "Guest" : "Guests"}`
        expect(screen.getByText(expected)).toBeTruthy()

        const [minusButton] = screen.getAllByRole("button")
        expect(minusButton.props.accessibilityState.disabled).toBe(
          expectedDisabled,
        )
      })
    })

    it("maintains stable props during rerenders", () => {
      render(<SidebarView {...defaultProps} number={5} />)

      const initialCallbacks = {
        onNumberChange: defaultProps.onNumberChange,
        onDishRemove: defaultProps.onDishRemove,
        onDishInterest: defaultProps.onDishInterest,
      }

      // Rerender with same props
      screen.rerender(<SidebarView {...defaultProps} number={5} />)

      // Verify callbacks weren't recreated
      expect(defaultProps.onNumberChange).toBe(initialCallbacks.onNumberChange)
      expect(defaultProps.onDishRemove).toBe(initialCallbacks.onDishRemove)
      expect(defaultProps.onDishInterest).toBe(initialCallbacks.onDishInterest)
    })
  })
})
