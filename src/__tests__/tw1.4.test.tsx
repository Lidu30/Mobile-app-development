import type { Dish } from "src/dishSource"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { SidebarView } from "src/views/sidebarView"

import { dishInformation } from "./mocks/mockFetch"

jest.mock("expo-router", ()=>({
    router:{
	push: jest.fn(()=>null)
    }
}));

describe("TW1.4 Handle native events, fire custom events", () => {
  const dishes = [
    dishInformation,
    { ...dishInformation, id: 42 },
    { ...dishInformation, id: 43 },
  ] satisfies readonly Dish[]

  it("handles native events (press) on the - and + buttons", () => {
    render(
      <SidebarView
        number={4}
        dishes={[]}
        onNumberChange={() => {}}
        onDishRemove={() => {}}
        onDishInterest={() => {}}
      />,
    )

    const buttons = screen.getAllByRole("button")

    expect(buttons).toHaveLength(2)

    const [minusButton, plusButton] = buttons
    expect(minusButton).toBeTruthy()
    expect(plusButton).toBeTruthy()
  })

  it("press on + or - buttons fires the onNumberChange custom event with new number", () => {
    let newNumber: number | undefined
    render(
      <SidebarView
        number={4}
        dishes={[]}
        onNumberChange={(nr) => {
          newNumber = nr
        }}
        onDishRemove={() => {}}
        onDishInterest={() => {}}
      />,
    )

    const [minusButton, plusButton] = screen.getAllByRole("button")

    fireEvent.press(minusButton)
    expect(newNumber).toBe(3)

    fireEvent.press(plusButton)
    expect(newNumber).toBe(5)
  })

  it("triggers onDishInterest when pressing a dish row", () => {
    let pressedDish: Dish | undefined
    render(
      <SidebarView
        number={4}
        dishes={dishes}
        onNumberChange={() => {}}
        onDishRemove={() => {}}
        onDishInterest={(dish) => {
          pressedDish = dish
        }}
      />,
    )

    const rows = screen.getAllByTestId("sidebar-row")
    expect(rows).toHaveLength(dishes.length)

    fireEvent.press(rows[0])
    expect(pressedDish).toBe(dishes[0])

    fireEvent.press(rows[1])
    expect(pressedDish).toBe(dishes[1])
  })

  it("triggers onDishRemove when pressing a dish remove button", () => {
    let removedDish: Dish | undefined
    render(
      <SidebarView
        number={4}
        dishes={dishes}
        onNumberChange={() => {}}
        onDishRemove={(dish) => {
          removedDish = dish
        }}
        onDishInterest={() => {}}
      />,
    )

    const removeButtons = screen.getAllByTestId("sidebar-row-remove")
    expect(removeButtons).toHaveLength(dishes.length)

    fireEvent.press(removeButtons[0])
    expect(removedDish).toBe(dishes[0])

    fireEvent.press(removeButtons[1])
    expect(removedDish).toBe(dishes[1])
  })
})
