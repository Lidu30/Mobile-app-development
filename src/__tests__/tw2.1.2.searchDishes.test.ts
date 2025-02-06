import type { SearchResults } from "../dishSource"
import { searchDishes } from "../dishSource"
import {dishesConst} from "src/dishesConst"
import {checkFetch} from "./utils/checkFetch"
import {recordPromiseCB, stopPromiseRecording, checkPromiseCB} from "./utils/checkCB";


// Mock the global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const mockSearchResponse: SearchResults = {
  results: dishesConst.slice(0, 3).map((dish) => ({
    id: dish.id,
    title: dish.title,
    image: dish.image,
    sourceUrl: dish.sourceUrl,
  })),
  totalResults: 3,
  offset: 0,
  number: 3,
}

describe("TW2.1.2 API call: search", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Setup default mock response
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSearchResponse),
      }),
    )
  })

  it("uses the correct proxy, API endpoint and HTTP headers", () => {
    let prms;
    recordPromiseCB();        
    try{
       prms=searchDishes({})
    }finally{ stopPromiseRecording(); }
    // expecting searchDishes to return a promise    
    expect(prms).toBeInstanceOf(Promise);
    expect(mockFetch).toHaveBeenCalled()
    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, []);
    checkPromiseCB("search dishes");
  })

  it("keeps only one of the API result properties: an array of dishes", async () => {
    const result = await searchDishes({})

    expect(result).toEqual(mockSearchResponse.results)
  })

  it("sends the correct query string: testing with type 'main course'", async () => {
    await searchDishes({ type: "main course" })

    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, [1758563338]);
  })

  it("sends the correct query string: testing with pizza as main course", async () => {
    await searchDishes({ query: "pizza", type: "main course" })

    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, [-1894851277, 1758563338]);
  })

  it("searchDishes strawberry pie as dessert", async () => {
    await searchDishes({ query: "strawberry pie", type: "dessert" })

    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, [-1015451899, 1496539523]);
  })

  it("searchDishes strawberry pie", async () => {
    await searchDishes({ query: "strawberry pie" })

    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, [-1015451899])
  })

  it("searchDishes with no search criteria (empty object)", async () => {
    await searchDishes({})

    const [url, params] = mockFetch.mock.calls[0]
    checkFetch(url, params.headers, -281827937, [])
  })

/*
  it("handles API errors appropriately", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    )

    await expect(searchDishes({})).rejects.toThrow()
  })*/
})
