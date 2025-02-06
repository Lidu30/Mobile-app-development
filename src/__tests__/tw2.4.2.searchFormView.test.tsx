import type { DishType } from "src/dishSource"
import type { SearchFormViewProps } from "src/views/searchFormView"
import { TextInput } from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { fireEvent, render } from "@testing-library/react-native"
import { SearchFormView } from "src/views/searchFormView"

jest.mock("expo-router", ()=>({
    router:{
	push: jest.fn(()=>null)
    }
}));

import {checkCB} from "./utils/checkCB"

describe("TW2.4.2 rendering recap, fire custom events: SearchFormView", () => {
  const renderWithProps = (props: Partial<SearchFormViewProps> = {}) => {
    const defaultProps: SearchFormViewProps = {
      dishTypeOptions: [],
      onText: jest.fn(),
      onType: jest.fn(),
      onSearchDish: jest.fn(),
    }
    return render(<SearchFormView {...defaultProps} {...props} />)
  }

  it("renders textbox, selection box and uses its text and type props", () => {
    // Test case 1: Empty options
    const { UNSAFE_getByType } = renderWithProps()

    expect(UNSAFE_getByType(TextInput)).toBeTruthy()
    expect(UNSAFE_getByType(SegmentedControl)).toBeTruthy()

    // Test case 2: With props
    const props = {
      dishTypeOptions: ["someType"] as unknown as DishType[],
      text: "bla",
      type: "someType" as DishType,
    }

    const { UNSAFE_getByType: getByType2 } = renderWithProps(props)
    expect(getByType2(TextInput).props.value).toBe("bla")
    expect(getByType2(SegmentedControl).props.selectedIndex).toBe(1)
  })

  it("renders dishTypeOptions prop (array rendering)", () => {
    const props = {
      dishTypeOptions: [
        "start",
        "main courze",
        "desser",
      ] as unknown as DishType[],
    }

    const { UNSAFE_getByType } = renderWithProps(props)
    const picker = UNSAFE_getByType(SegmentedControl)

    expect(picker.props.values).toEqual(["All", ...props.dishTypeOptions])
  })

  it("performs array rendering rather than repeating UI", () => {
    const testCases = [
      { dishTypeOptions: ["starter", "main course", "dessert"] },
      { dishTypeOptions: ["primero", "segundo", "tercero", "cuarto"] },
    ]

    testCases.forEach(({ dishTypeOptions }) => {
      const { UNSAFE_getByType } = renderWithProps({
        dishTypeOptions: dishTypeOptions as DishType[],
      })
      const picker = UNSAFE_getByType(SegmentedControl)
      expect(picker.props.values).toEqual(["All", ...dishTypeOptions])
    })
  })

  it("fires custom events on text or type change, and on button press", () => {
    const onText = jest.fn()
    const onType = jest.fn()
    const onSearchDish = jest.fn()

    const props = {
      dishTypeOptions: ["starter", "main course", "dessert"] as DishType[],
      onText,
      onType,
      onSearchDish,
    }

    const { UNSAFE_getByType } = renderWithProps(props)

    // Test text input
    const input = UNSAFE_getByType(TextInput)

    fireEvent.changeText(input, "some pizza")
    expect(onText).toHaveBeenCalledWith("some pizza")

    // Test type selection
    const picker = UNSAFE_getByType(SegmentedControl)
    fireEvent(picker, "valueChange", "starter")
    expect(onType).toHaveBeenCalledWith("starter")
    expect(onSearchDish).toHaveBeenCalled()

    checkCB(input.props.onChangeText)
    checkCB(input.props.onSubmitEditing)
    checkCB(picker.props.onValueChange)

})

  it("does not mutate its props during rendering", () => {
    const props = {
      dishTypeOptions: ["starter", "main course", "dessert"] as DishType[],
    }
    const originalProps = JSON.stringify(props)

    renderWithProps(props)

    expect(JSON.stringify(props)).toBe(originalProps)
  })
})
