import { observer } from "mobx-react-lite";
import { SearchFormView } from "src/views/searchFormView";
import { SearchResultsView } from "src/views/searchResultsView";
import { SuspenseView } from "src/views/suspenseView";

export const Search = observer(function Search(props) {
    const searchResultsPromiseState = props.model.searchResultsPromiseState;
    const searchText = props.model.searchParams.query; 
    const searchDishType = props.model.searchParams.type; 

    function searchData() {
        if (searchResultsPromiseState.data) {
            return <SearchResultsView 
                searchResults = {searchResultsPromiseState.data}
                dishChosen = {chooseDishACB}
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
    }

    function setSearchTextACB(newText) {
        props.model.setSearchQuery(newText);
    }

    function searchNowACB() {
        props.model.doSearch(props.model.searchParams);
    }

    return (
        <>
            <SearchFormView 
                dishTypeOptions = {["starter", "main course", "dessert"]}
                text = {searchText}
                type = {searchDishType}
                onType={setSearchTypeACB}
                onText={setSearchTextACB}
                onSearchDish={searchNowACB}
            />
            {searchData()}
        </>
    );
});
