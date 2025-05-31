/* 
   The Model keeps the state of the application (Application State). 
   It is an abstract object, i.e. it knows nothing about graphics and interaction.
*/

import { getDishDetails, searchDishes } from "src/dishSource"
import { resolvePromise } from "src/resolvePromise"

export const model = {
  numberOfGuests: 2,
  dishes: [],
  currentDishId: null, // null means "intentionally empty"
  searchParams: {
    offset: 0,
  },
  searchResultsPromiseState: {},
  currentDishPromiseState: {},
  user: undefined,

  setCurrentDishId(dishId) {
    this.currentDishId = dishId
  },

  setNumberOfGuests(number) {
    if (Number.isInteger(number) && number > 0) {
      this.numberOfGuests = number
    } else {
      throw new Error("number of guests not a positive integer")
    }
  },

  addToMenu(dishToAdd) {
    // array spread syntax exercise
    // It sets this.dishes to a new array [   ] where we spread (...) the elements of the existing this.dishes
    this.dishes = [...this.dishes, dishToAdd]
  },

  // filter callback exercise
  removeFromMenu(dishToRemove) {
    function shouldWeKeepDishCB(dish) {
      return dishToRemove.id !== dish.id
    }
    this.dishes = this.dishes.filter(shouldWeKeepDishCB)
  },

  setSearchQuery(query) {
    this.searchParams.query = query
  },

  setSearchType(type) {
    this.searchParams.type = type
  },

  setSearchOffset(offset) {
    this.searchParams.offset = offset;
  },

  doSearch(params) {
    const searchPromise = searchDishes(params)
    const isInitialSearch = !params.offset;
    const self = this;

    /*if (isInitialSearch) {
      this.searchResultsPromiseState.data = null;
      this.searchResultsPromiseState.error = null;
    }*/
    
    resolvePromise(searchPromise, this.searchResultsPromiseState, transformData)
  
    function transformData(newResult) {
      const previous = self.searchResultsPromiseState?.data || [];

      if (isInitialSearch || previous.length === 0) {
        return newResult;
      }

      return [...previous, ...(newResult || [])];
    }
  
  },

  currentDishEffect() {
    if (!this.currentDishId) {
      this.currentDishPromiseState = { promise: null, data: null, error: null }
      return;
    }
    const dishPromise = getDishDetails(this.currentDishId)

    this.currentDishPromiseState.data = null;
    this.currentDishPromiseState.error = null;

    resolvePromise(dishPromise, this.currentDishPromiseState)
  },

  // more methods will be added here, don't forget to separate them with comma!
}
