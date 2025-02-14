import { observer } from "mobx-react-lite";
import { SidebarView } from "src/views/sidebarView";

export const Sidebar = observer(function SidebarRender(props) {
    function updateGuestNumberACB(newNumber) {
        console.log("New guest count:", newNumber);
        props.model.setNumberOfGuests(newNumber);
    }

    function showDishACB(dish){
        console.log("Show dish: ", dish);
        props.model.setCurrentDishId(dish.id)
    }

    function removeDishACB(dish){
        console.log("Remove dish: ", dish);
        props.model.removeFromMenu(dish)
    }

    return <SidebarView number={props.model.numberOfGuests}
                        dishes={props.model.dishes}
                        onNumberChange={updateGuestNumberACB}
                        onDishInterest={showDishACB} 
                        onDishRemove={removeDishACB}/>;
});