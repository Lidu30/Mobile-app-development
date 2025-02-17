import { observer } from "mobx-react-lite";
import { SearchFormView } from "src/views/searchFormView";
import { SearchResultsView } from "src/views/searchResultsView";
import { SuspenseView } from "src/views/suspenseView";

export const Search = observer(function Search(props) {
    const searchResultsPromiseState = props.model.searchResultsPromiseState;

    return (
        <>
            <SearchFormView />
            {searchResultsPromiseState.data && <SearchResultsView /> || <SuspenseView />}
        </>
    );
});
