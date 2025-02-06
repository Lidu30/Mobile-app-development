import type { Dish } from "src/dishSource"
import type { DetailsViewProps } from "src/views/detailsView"
import { Linking } from "react-native"
import { Image } from "expo-image"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { DetailsView } from "src/views/detailsView"
import {checkCB} from "./utils/checkCB"

jest.mock("react/jsx-runtime", ()=>{
   const jsxz= jest.requireActual('react/jsx-runtime');
   function evts(prps){
     return Object.keys(prps).filter(x=>x.startsWith("on")).reduce((acc,k)=>({...acc, ["__"+k]:prps[k]}), {})
   }
   return {
   ... jsxz,
   jsxs(comp, props, ...rest){
           return jsxz.jsxs(comp,{... props, ...evts(props)}, ...rest);	
   },
   jsx(comp, props, ...rest){
        return jsxz.jsx(comp,{... props, ...evts(props)}, ...rest);
      }	     
}
})

// Mock the Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}))

jest.mock("expo-router", ()=>({
    router:{
	push: jest.fn(()=>null)
    }
}));

describe("TW2.4.4 DetailsView", () => {
  const mockDish = {
    id: 1,
    title: "Test Dish",
    summary: "Test dish summary",
    image: "https://example.com/image.jpg",
    sourceUrl: "https://example.com/recipe",
    pricePerServing: 10,
    extendedIngredients: [
      { id: 1, name: "Ingredient 1", amount: 100, unit: "g", aisle: "Aisle" },
      { id: 2, name: "Ingredient 2", amount: 2, unit: "tbsp", aisle: "Aisle" },
    ],
    analyzedInstructions: [
      {
        name: "Instructions",
        steps: [
          { number: 1, step: "Step 1 instruction" },
          { number: 2, step: "Step 2 instruction" },
        ],
      },
    ],
  } satisfies Dish

  const defaultProps = {
    dishData: mockDish,
    guests: 3,
    isDishInMenu: false,
    userWantsToAddDish: jest.fn(),
  } satisfies DetailsViewProps

  it("renders dish price and total price for guests", () => {
    render(<DetailsView {...defaultProps} />)

    expect(screen.getByText("Price per serving: 10.00")).toBeTruthy()
    expect(screen.getByText("Total for 3 guests: 30.00")).toBeTruthy()
  })

  it("renders all ingredients with amounts and units", () => {
    render(<DetailsView {...defaultProps} />)

    mockDish.extendedIngredients.forEach((ingredient) => {
      const pattern = new RegExp(
        `${ingredient.amount}.*${ingredient.unit}.*${ingredient.name}`,
      )
      expect(screen.getByText(pattern)).toBeTruthy()
    })
  })

  it("renders cooking instructions", () => {
    render(<DetailsView {...defaultProps} />)

    mockDish.analyzedInstructions[0]?.steps.forEach((instruction) => {
      expect(
        screen.getByText(`${instruction.number}. ${instruction.step}`),
      ).toBeTruthy()
    })
  })

  it("has a link to recipe that opens in browser", () => {
    render(<DetailsView {...defaultProps} />)

    const moreInfoButton = screen.getByRole("button", {name: "More info"}) //getByText("More info")
    expect(moreInfoButton).toBeTruthy()
    
    fireEvent.press(moreInfoButton)
    expect(Linking.openURL).toHaveBeenCalledWith(mockDish.sourceUrl)

    // __onPress is the same as the original onPress which is removed by React during rendering
    // see the jsx-runtime mocking above
    checkCB(moreInfoButton.props.__onPress)

})

  it("renders dish image (from expo-image)", () => {
    render(<DetailsView {...defaultProps} />)

    const image = screen.UNSAFE_getByType(Image)
    expect(image).toBeTruthy()
  })

  it("has add to menu button that is disabled when dish is in menu", () => {
    const { rerender } = render(<DetailsView {...defaultProps} />)

    let button = screen.getByRole("button", { name: "Add to menu" })
    expect(button).toBeTruthy()
    
    expect(button.props.accessibilityState.disabled).toBe(false)

    rerender(<DetailsView {...defaultProps} isDishInMenu={true} />)
    button = screen.getByRole("button", { name: "Added to menu" })
    expect(button.props.accessibilityState.disabled).toBe(true)
  })

  it("fires add to menu event when button is clicked", () => {
    render(<DetailsView {...defaultProps} />)

    const addButton = screen.getByRole("button", {name:"Add to menu"})

    fireEvent.press(addButton)
    expect(defaultProps.userWantsToAddDish).toHaveBeenCalled()
    // __onPress is the same as the original onPress which is removed by React during rendering
    // see the jsx-runtime mocking above
    checkCB(addButton.props.__onPress)
})

  it("does not mutate props during rendering", () => {
    const propsCopy = {
      ...defaultProps,
      userWantsToAddDish: defaultProps.userWantsToAddDish,
    }
    render(<DetailsView {...defaultProps} />)

    expect(defaultProps).toEqual(propsCopy)
  })
})
