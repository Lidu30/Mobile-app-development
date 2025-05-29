import { observer } from "mobx-react-lite";
import { SearchFormView } from "src/views/searchFormView";
import { SearchResultsView } from "src/views/searchResultsView";
import { SuspenseView } from "src/views/suspenseView";
import { debounce, throttle } from 'lodash';
import { useMemo } from 'react';

export const Search = observer(function Search(props) {
    const searchResultsPromiseState = props.model.searchResultsPromiseState;
    const searchText = props.model.searchParams.query; 
    const searchDishType = props.model.searchParams.type; 
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

    function setSearchTextACB(newText) {
        props.model.setSearchQuery(newText);
    }

    function loadMoreResultsACB() {
        props.model.setSearchOffset(offset + 10);
        throttledSearch();
    }

    function setDebouncedSearchTextACB(newText) {
        props.model.setSearchQuery(newText);
        props.model.setSearchOffset(0);
        throttledSearch();
    }

    const debouncedTextInput = debounce(setDebouncedSearchTextACB, 250);

    function searchNowACB() {      
        props.model.doSearch(props.model.searchParams);
    }

    const throttledSearch = useMemo(() => throttle(searchNowACB, 1000), [props.model]);

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
