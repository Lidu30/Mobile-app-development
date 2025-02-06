import type { PromiseState } from "../resolvePromise"
import { resolvePromise } from "../resolvePromise"

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

describe("TW2.2.1 resolvePromise", () => {
  jest.setTimeout(200000)

  it("resolvePromise sets data after the promise resolves", async () => {
    const promiseState: PromiseState<number> = {}

    resolvePromise(
      sleep(10).then(() => 42),
      promiseState,
    )

    expect(promiseState.promise).toBeTruthy()
    expect(promiseState.data).toBeNull()
    expect(promiseState.error).toBeNull()

    await sleep(15)

    expect(promiseState.promise).toBeTruthy()
    expect(promiseState.data).toBe(42)
    expect(promiseState.error).toBeNull()
  })

  it("resolvePromise sets error after the promise rejects", async () => {
    const promiseState: PromiseState<never> = {}

    resolvePromise(
      sleep(10).then(() => {
        throw 42
      }),
      promiseState,
    )

    expect(promiseState.promise).toBeTruthy()
    expect(promiseState.data).toBeNull()
    expect(promiseState.error).toBeNull()

    await sleep(15)

    expect(promiseState.promise).toBeTruthy()
    expect(promiseState.error).toBe(42)
    expect(promiseState.data).toBeNull()
  })

  it("resolvePromise checks for falsy promise", async () => {
    const promiseState: PromiseState<unknown> = {promise:"dummy promise", data:"dummy data", error:"dummy error"};
    expect(() => resolvePromise(null, promiseState)).not.toThrow()
    expect(promiseState.promise || promiseState.data || promiseState.error).toBeFalsy()

    const promiseState1: PromiseState<unknown> = {promise:"dummy promise", data:"dummy data", error:"dummy error"};
    expect(() => resolvePromise(undefined, promiseState1)).not.toThrow()
    expect(promiseState1.promise || promiseState1.data || promiseState1.error).toBeFalsy()
  })

  it("resolvePromise check for race condition", async () => {
    const promiseState: PromiseState<string> = {}

    interface NamedPromise<T> extends Promise<T> {
      name: string
    }

    const makeCallback = (ms: number) => async () => {
      const promise = sleep(ms).then(
        () => `resolved after ${ms}`,
      ) as NamedPromise<string>
      promise.name = `promiseToResolveAfter_${ms}`
      resolvePromise(promise, promiseState)
      return promise
    }

    await Promise.all([
      sleep(1).then(makeCallback(100)),
      sleep(3).then(makeCallback(2)),
    ])

    expect(promiseState.promise).toBeTruthy()
    expect((promiseState.promise as NamedPromise<string>).name).toBe(
      "promiseToResolveAfter_2",
    )
    expect(promiseState.data).toBe("resolved after 2")
  })
})
