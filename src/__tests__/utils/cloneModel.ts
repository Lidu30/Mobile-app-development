import type { DinnerModel } from "src/DinnerModel"

// one-level cloning
export default function cloneModel<T extends DinnerModel>(model: T): T {
  const ret = { ...model }
  Object.entries(model).forEach(function ([key, value]) {
    if (value && typeof value === "object") {
      ret[key as keyof T] = Array.isArray(value) ? [...value] : { ...value }
    }
  })
  return ret
}
