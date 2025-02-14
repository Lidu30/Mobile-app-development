import { observer } from "mobx-react-lite";
import { SummaryView } from "src/views/summaryView";
import { shoppingList } from "src/utilities";

export const Summary = observer(function SummaryRender(props) {
    return <SummaryView people={props.model.numberOfGuests}
                        ingredients={shoppingList(props.model.dishes)}/>;
});
