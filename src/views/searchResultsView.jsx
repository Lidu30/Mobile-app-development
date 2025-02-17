
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
            return <SearchResultsView searchResults = {searchResultsPromiseState.data}
                    dishChosen = {console.log}
                    />
        }

        return <SuspenseView 
                    promise = {searchResultsPromiseState.promise}
                    error = {searchResultsPromiseState.error}
                />
    }

    return (
        <>
            <SearchFormView 
                dishTypeOptions = {["starter", "main course", "dessert"]}
                text = {searchText}
                type = {searchDishType}
                onType={console.log}
                onText={console.log}
                onSearchDish={console.log}
            />
            {searchData()}
        </>
    );
});

