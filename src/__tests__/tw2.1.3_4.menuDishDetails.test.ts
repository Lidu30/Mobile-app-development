import { getDishDetails, getMenuDetails } from "src/dishSource"

import {dishesConst} from "src/dishesConst"

import {checkFetch} from "./utils/checkFetch"
import {recordPromiseCB, stopPromiseRecording, checkPromiseCB} from "./utils/checkCB";

const mockResponse = (data: unknown) =>
  Promise.resolve({
    ok: data?true:false,
    statusText:data?"OK":"Not found",
    status: data?200:404,
    json: () => Promise.resolve(data || {msg: "invalid IDs"}),
  } as Response)

describe("TW2.1.3 API call: getMenuDetails", () => {
  it("should fetch menu details with correct parameters", async () => {
    const mockDishes = [dishesConst[0], dishesConst[1]]
    const dishIds = mockDishes.map((dish) => dish.id)

    global.fetch = jest
      .fn()
      .mockImplementationOnce((url: string, init?: RequestInit) => {
        // Verify URL and headers

        checkFetch(url, init?.headers, -1115178555, [-1840291832]);
        return mockResponse(mockDishes)
      })

    let prms;
    recordPromiseCB();		
    try{
       prms= getMenuDetails(dishIds)
    }finally{ stopPromiseRecording(); }

    expect(prms).toBeInstanceOf(Promise)
    const result = await prms;

    expect(result).toStrictEqual(mockDishes)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    checkPromiseCB("getMenuDetails");
  })

  it("rejects if the underlying fetch fails", async () => {
    global.fetch = jest.fn().mockImplementationOnce((url, init) => {
        checkFetch(url, init?.headers, -1115178555, [-1350703509])
    	return mockResponse();
    })

    // passing an undefined will normally induce a proxy error
    await expect(getMenuDetails(["undefined"])).rejects.toThrow()
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})

describe("TW2.1.4 API call: getDishDetails", () => {
  it("should fetch single dish details correctly", async () => {
    const mockDish = dishesConst[0]

    global.fetch = jest
      .fn()
      .mockImplementationOnce((url: string, init?: RequestInit) => {
        checkFetch(url, init?.headers, -1115178555, [100061260]);
        return mockResponse([mockDish])
      })

    const result = await getDishDetails(mockDish.id)

    expect(result).toStrictEqual(mockDish)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it("should handle another dish ID correctly", async () => {
    const mockDish = dishesConst[1]

    global.fetch = jest.fn().mockImplementationOnce((url: string, init?: RequestInit) => {
      checkFetch(url, init?.headers, -1115178555, [100061261]);	 
      return mockResponse([mockDish])
    })

    const result = await getDishDetails(mockDish.id)

    expect(result).toStrictEqual(mockDish)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
