import type { DinnerModel } from "src/DinnerModel"
import { render } from "@testing-library/react-native"
import { dishesConst } from "src/dishesConst"
import { Sidebar } from "src/presenters/sidebarPresenter"
import { SidebarView } from "src/views/sidebarView"

const { dishes3 } = dishesConst

// Mock the expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}))

// Mock the SidebarView component
jest.mock("src/views/sidebarView", () => ({
  SidebarView: jest.fn(() => null),
}))

describe("TW1.5 Presenter handles custom events and changes Model", () => {
  let mockModel: Partial<DinnerModel>

  beforeEach(() => {
    const SidebarViewMock = SidebarView as jest.Mock
    SidebarViewMock.mockClear()
    mockModel = {
      numberOfGuests: 2,
      dishes: [],
      setNumberOfGuests: jest.fn(),
      removeFromMenu: jest.fn(),
      setCurrentDishId: jest.fn(),
    }
  })

  it("Sidebar presenter handles the onNumberChange custom event", () => {
    render(<Sidebar model={mockModel as DinnerModel} />)

    // Get the props passed to SidebarView
    const sidebarViewProps = (SidebarView as jest.Mock).mock.calls[0][0]

    // Trigger number change
    sidebarViewProps.onNumberChange(3)
    expect(mockModel.setNumberOfGuests).toHaveBeenCalledWith(3)

    sidebarViewProps.onNumberChange(5)
    expect(mockModel.setNumberOfGuests).toHaveBeenCalledWith(5)
  })

  it("Sidebar presenter handles dish interest event", () => {
    mockModel.dishes = dishes3

    render(<Sidebar model={mockModel as DinnerModel} />)

    const sidebarViewProps = (SidebarView as jest.Mock).mock.calls[0][0]

    const testDish = dishes3[2]
    if (!testDish) throw new Error("Test dish not found")
    sidebarViewProps.onDishInterest(testDish)

    expect(mockModel.setCurrentDishId).toHaveBeenCalledWith(testDish.id)
  })

  it("Sidebar presenter handles dish removal event", () => {
    mockModel.dishes = dishes3

    render(<Sidebar model={mockModel as DinnerModel} />)

    const sidebarViewProps = (SidebarView as jest.Mock).mock.calls[0][0]

    const dishToRemove = dishes3[1]
    sidebarViewProps.onDishRemove(dishToRemove)

    expect(mockModel.removeFromMenu).toHaveBeenCalledWith(dishToRemove)
    expect(mockModel.setCurrentDishId).not.toHaveBeenCalled()
  })
})
