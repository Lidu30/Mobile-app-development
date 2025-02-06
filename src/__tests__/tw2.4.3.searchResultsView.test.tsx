import { FlatList, Pressable } from "react-native"
import { Image } from "expo-image"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { SearchResultsView } from "src/views/searchResultsView"
import { checkCB } from "./utils/checkCB"

jest.mock("expo-router", ()=>({
    router:{
	push: jest.fn(()=>null)
    }
}));

const mockSearchResults=[
    {
      id: 1,
      title: "Spaghetti Carbonara",
      image: "https://example.com/carbonara.jpg",
      sourceUrl: "https://example.com/recipe1",
    },
    {
      id: 2,
      title: "Pizza Margherita",
      image: "https://example.com/pizza.jpg",
      sourceUrl: "https://example.com/recipe2",
    },
  ];

describe("TW2.4.3 SearchResultsView", () => {
  it("renders FlatList with correct configuration", () => {
    const { UNSAFE_getByType } = render(
      <SearchResultsView
        searchResults={mockSearchResults}
        dishChosen={() => {}}
      />,
    )

    const flatList = UNSAFE_getByType(FlatList)
    expect(flatList.props.numColumns).toBe(2)
    expect(flatList.props.data).toBe(mockSearchResults)
  })

  it("renders dishes with titles and expo-images", () => {
    render(
      <SearchResultsView
        searchResults={mockSearchResults}
        dishChosen={() => {}}
      />,
    )

    mockSearchResults.forEach((dish) => {
      expect(screen.getByText(dish.title)).toBeTruthy()
      const images = screen.UNSAFE_getAllByType(Image)
      const dishImage = images.find(
        (img) => img.props.source === dish.image || img.props.source.uri === dish.image,
      )
      expect(dishImage).toBeTruthy()
      expect(dishImage.props.style).toMatchObject({
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
      })
    })
  })

  it("calls dishChosen with correct dish when pressed", () => {
    const mockDishChosen = jest.fn()
    render(
      <SearchResultsView
        searchResults={mockSearchResults}
        dishChosen={mockDishChosen}
      />,
    )

    const buttons = screen.UNSAFE_getAllByType(Pressable)//getAllByRole("button")
    fireEvent.press(buttons[0])
    expect(mockDishChosen).toHaveBeenCalledWith(mockSearchResults[0])
    checkCB(buttons[0].props.onPress)
})

  it("maintains props immutability", () => {
    const props = {
      searchResults: mockSearchResults,
      dishChosen: () => {},
    }
    const originalProps = JSON.parse(JSON.stringify(props))

    render(<SearchResultsView {...props} />)

    expect(props.searchResults).toEqual(originalProps.searchResults)
  })

  it("limits dish titles to 3 lines", () => {
    render(
      <SearchResultsView
        searchResults={mockSearchResults}
        dishChosen={() => {}}
      />,
    )

    const titles = screen.getAllByText(/./)
    titles.forEach((title) => {
      expect(title.props.numberOfLines).toBe(3)
    })
  })
})
