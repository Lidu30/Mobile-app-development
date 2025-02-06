import { PROXY_KEY, PROXY_URL } from "../apiConfig"

describe("TW2.1.1 API config", () => {
  it("apiConfig exports PROXY_URL and PROXY_KEY", () => {
    expect(PROXY_URL).toBeDefined()
    expect(PROXY_KEY).toBeDefined()
    expect(typeof PROXY_URL).toBe("string")
    expect(typeof PROXY_KEY).toBe("string")
  })

  it("Check PROXY_URL is correct", () => {
    const urlRegex = /^https:\/\/brfenergi\.se\/iprog\/group\/[0-9]/
    expect(PROXY_URL).toMatch(urlRegex)
  })

  it("Check length of PROXY_KEY", () => {
    expect(PROXY_KEY).toHaveLength(50)
  })
})
