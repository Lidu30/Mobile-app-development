import { Text, View } from "react-native"
import { render, screen } from "@testing-library/react-native"
import { dishesConst } from "src/dishesConst"
import { Sidebar } from "src/presenters/sidebarPresenter"
import { Summary } from "src/presenters/summaryPresenter"
import { SidebarView } from "src/views/sidebarView"
import { SummaryView } from "src/views/summaryView"
import { act } from "react"

import {observable, configure} from "mobx"
configure({enforceActions:"never"})

import { mockModel, resetMockModel } from "./mocks/mockModel"

const { dishes1, dishes2, ingrList1, ingrList2 } = dishesConst

jest.mock("src/views/summaryView", () => ({
  SummaryView: jest.fn(() => null),
}))

jest.mock("src/views/sidebarView", () => ({
  SidebarView: jest.fn(() => "sidebar"),
}))

describe("TW1.2.2 Pass props from Presenter to View", () => {
  afterEach(() => {
    jest.clearAllMocks()
    resetMockModel()
  })

  describe("Summary Presenter", () => {
    it("renders SummaryView with correct people prop", () => {
      const testCases = [
        { guests: 2, dishes: [] },
        { guests: 5, dishes: [] },
      ] as const

      testCases.forEach(({ guests, dishes }) => {
        const model = {
          ...mockModel,
          numberOfGuests: guests,
          dishes: [...dishes],
        }
        render(<Summary model={model} />)

        expect(SummaryView).toHaveBeenCalledWith(
          expect.objectContaining({
            people: guests,
          }),
          expect.anything(),
        )
      })
    })

    it("passes correct ingredients prop to SummaryView", () => {
      const testCases = [
        { guests: 3, dishes: dishes1, expectedIngredients: ingrList1 },
        { guests: 5, dishes: dishes2, expectedIngredients: ingrList2 },
      ] as const

      testCases.forEach(({ guests, dishes, expectedIngredients }) => {
        const model = { ...mockModel, numberOfGuests: guests, dishes }
        render(<Summary model={model} />)

        expect(SummaryView).toHaveBeenCalledWith(
          expect.objectContaining({
            ingredients: expect.arrayContaining(
              expectedIngredients.map((ingr) =>
                expect.objectContaining({
                  name: ingr.name,
                  amount: ingr.amount,
                  unit: ingr.unit,
                  aisle: ingr.aisle,
                }),
              ),
            ),
          }),
          expect.anything(),
        )
      })
    })
  })

  describe("Sidebar Presenter", () => {
    it("renders SidebarView with correct number prop", () => {
      const testCases = [
        { guests: 7, dishes: [] },
        { guests: 10, dishes: [] },
      ] as const

      testCases.forEach(({ guests, dishes }) => {
        const model = {
          ...mockModel,
          numberOfGuests: guests,
          dishes: [...dishes],
        }
        render(<Sidebar model={model} />)

        expect(SidebarView).toHaveBeenCalledWith(
          expect.objectContaining({
            number: guests,
          }),
          expect.anything(),
        )
      })
    })

    it("passes correct dishes prop to SidebarView", () => {
      const testCases = [
        { guests: 7, dishes: dishes1 },
        { guests: 10, dishes: dishes2 },
      ] as const

      testCases.forEach(({ guests, dishes }) => {
        const model = { ...mockModel, numberOfGuests: guests, dishes }
        render(<Sidebar model={model} />)

        expect(SidebarView).toHaveBeenCalledWith(
          expect.objectContaining({
            dishes: expect.arrayContaining(
              dishes.map((dish) =>
                expect.objectContaining({
                  id: dish.id,
                  title: dish.title,
                }),
              ),
            ),
          }),
          expect.anything(),
        )
      })
    })
     it("Sidebar is an observer", async () => {      
        const model = observable({ ...mockModel, numberOfGuests: 2, dishes:[] })
        render(<Sidebar model={model} />)

        expect(SidebarView).toHaveBeenCalledWith(
          expect.objectContaining({
	     number: 2
          }),
          expect.anything(),
        )
	SidebarView.mockClear()
	act(()=> model.numberOfGuests=7)
	await new Promise(r=>setTimeout(r))
	expect(SidebarView).toHaveBeenCalledWith(
          expect.objectContaining({
	     number: 7
          }),
          expect.anything(),
        )
      })

  })


})
