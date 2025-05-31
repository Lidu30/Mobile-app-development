import { observer } from "mobx-react-lite";
import { SearchFormView } from "src/views/searchFormView";
import { SearchResultsView } from "src/views/searchResultsView";
import { SuspenseView } from "src/views/suspenseView";
// debounce - waits for a user to stop typing before triggering a function
// throttle :  Ensures a function can only run once per time period(1 per sec in our case)
// import { debounce, throttle } from 'lodash';
// import { useMemo } from 'react';

export const Search = observer(function Search(props) {
    const searchResultsPromiseState = props.model.searchResultsPromiseState;
    const searchText = props.model.searchParams.query; 
    const searchDishType = props.model.searchParams.type; 
    // in order to request the correct page of results
    const offset = props.model.searchParams.offset;

    function searchData() {
        if (searchResultsPromiseState.data) {
            return <SearchResultsView 
                searchResults = {searchResultsPromiseState.data}
                dishChosen = {chooseDishACB}
                loadMoreResults={loadMoreResultsACB}
            />
        }

        return <SuspenseView 
                    promise = {searchResultsPromiseState.promise}
                    error = {searchResultsPromiseState.error}
                />
    }

    function chooseDishACB(dish) {
        console.log("Dish selected: ", dish);
        props.model.setCurrentDishId(dish.id);
    }

    function setSearchTypeACB(newType) {
        props.model.setSearchType(newType)
        props.model.setSearchOffset(0);
    }

    // decouncing
    function setSearchTextACB(newText) {
        props.model.setSearchQuery(newText);
    }

    // infinite-increases the offset and perform another search
    function loadMoreResultsACB() {
        props.model.setSearchOffset(offset + 10);
        throttledSearch();
    }

    function setDebouncedSearchTextACB(newText) {
        props.model.setSearchQuery(newText);
        props.model.setSearchOffset(0);
        // triggers the actual search
        throttledSearch();
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
            func.apply(this, args);
            }, delay);
        };
    }

    function throttle(func, delay) {
        let lastCall = 0;  
        return function(...args) {
            const now = Date.now(); 
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    // waits 250 ms after the user stops before calling the function
    const debouncedTextInput = debounce(setDebouncedSearchTextACB, 250);

    function searchNowACB() {      
        props.model.doSearch(props.model.searchParams);
    }

    // creates throrrled version of search now
    // runs at most once per sec(no more than 1 search per sec)
    const throttledSearch = throttle(searchNowACB, 1000);

    return (
        <>
            <SearchFormView 
                dishTypeOptions = {["starter", "main course", "dessert"]}
                text = {searchText}
                type = {searchDishType}
                onType={setSearchTypeACB}
                onText={debouncedTextInput}
                onSearchDish={throttledSearch}
            />
            {searchData()}
        </>
    );
});
