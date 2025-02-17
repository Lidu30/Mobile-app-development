import { observer } from "mobx-react-lite";
import { DetailsView } from "src/views/detailsView";
import { SuspenseView } from "src/views/suspenseView";

export const Details = observer(function Details(props) {
    const currentDishPromiseState = props.model.currentDishPromiseState;
    const isDishInMenu = !!props.model.dishes.find(checkDishInMenu)

    function checkDishInMenu(dish){
        return dish.id ===props.model.currentDishId;
    }

    if (currentDishPromiseState.data) {
        return <DetailsView
            dishData = {currentDishPromiseState.data}
            guests = {props.model.numberOfGuests}
            isDishInMenu = {isDishInMenu} 
        />;
    }
    return <SuspenseView
        promise ={currentDishPromiseState.promise}
        error = {currentDishPromiseState.error} 
    />;
})
