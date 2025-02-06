import { Image } from "expo-image"
import { SuspenseView } from "src/views/suspenseView"
import { screen, render } from "@testing-library/react-native"

jest.mock("expo-image", () => ({
  Image: jest.fn(x => "mock image"),
}))

describe("TW2.4.1 SuspenseView", () => {

  it("renders no data state when no promise exists", () => {
    render(<SuspenseView />);
    expect(screen.getByText(/no data/i)).toBeTruthy()
    expect(()=>screen.getByText("big error", { exact: false })).toThrow()
    expect(()=>screen.UNSAFE_getByType(Image)).toThrow()
  })

  it("renders loading state when promise exists without data", () => {
    render(<SuspenseView promise="dummy promise" />)
    expect(screen.UNSAFE_getByType(Image)).toBeTruthy()
    expect(Image).toHaveBeenCalledWith(expect.objectContaining({
      source: expect.anything(),
      // style your image!
      style: expect.anything()
    }), expect.anything());
    expect(()=>screen.getByText(/no data/i)).toThrow()
    expect(()=>screen.getByText("big error", { exact: false })).toThrow()
  })

  it("renders error state when promise rejected", async () => {
    render(<SuspenseView promise="big promise"  error={new Error("big error")} />)
    expect(screen.getByText("big error", { exact: false })).toBeTruthy()
    expect(()=>screen.UNSAFE_getByType(Image)).toThrow()
    expect(()=>screen.getByText(/no data/i)).toThrow()
  })
})
