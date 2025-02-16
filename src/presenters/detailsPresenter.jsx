import { observer } from "mobx-react-lite";
import { DetailsView } from "src/views/detailsView";
import { SuspenseView } from "src/views/suspenseView";

export const Details = observer(function Details(props) {
    const currentDishPromiseState = props.model.currentDishPromiseState;

    return currentDishPromiseState.promise && !currentDishPromiseState.data ?  <SuspenseView/> : <DetailsView/> ;
})
  