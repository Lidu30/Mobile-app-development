import { Text, View } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { SidebarView } from "src/views/sidebarView";
import { SearchResultsView } from "src/views/searchResultsView";
import { DetailsView } from "src/views/detailsView";
import {dishesConst} from "src/dishesConst";
import { router } from "expo-router";

jest.mock("expo-router", ()=>({
    router:{
	push: jest.fn(()=>null)
    }
}));

const mockSearchResults=[
    {
      id: 1,
      title: "Spaghetti Carbonara",
      image: "https://example.com/carbonara.jpg",
      sourceUrl: "https://example.com/recipe1",
    },
    {
      id: 2,
      title: "Pizza Margherita",
      image: "https://example.com/pizza.jpg",
      sourceUrl: "https://example.com/recipe2",
    },
];

describe("TW 3.3 navigation buttons", ()=>{
    it("DetailsView dish adding button should lead to 'sidear' (home)", () => {

	render(<DetailsView dishData={ dishesConst[2]}
	       guests= {3}
	       isDishInMenu={false}
	       userWantsToAddDish={d=>null} />);

	const addButton = screen.getByText("Add to menu");
	fireEvent.press(addButton);

	expect(router.push).toHaveBeenCalledWith("/");
    });

    it("SidebarView dish row press should open dish details", () => {
	render(<SidebarView
               number={4}
               dishes={dishesConst.slice(0, 2)}
               onNumberChange={() => {}}
               onDishRemove={() => {}}
               onDishInterest={d => null}
	       />);
	
	const rows = screen.getAllByTestId("sidebar-row");
	expect(rows).toHaveLength(2);
	
	fireEvent.press(rows[0]);
	expect(router.push).toHaveBeenCalledWith("/details");
	router.push.mockClear();
	fireEvent.press(rows[1]);
	expect(router.push).toHaveBeenCalledWith("/details");
    });

    it("SearchResultsView dish press should lead to details", () => {
	render(<SearchResultsView
	       searchResults={mockSearchResults}
	       dishChosen={() => {}}
	       />);
	
	const buttons = screen.getAllByRole("button");
	fireEvent.press(buttons[0]);
	
	expect(router.push).toHaveBeenCalledWith("/details");
	router.push.mockClear();
	fireEvent.press(buttons[1]);
	expect(router.push).toHaveBeenCalledWith("/details");
    });

});
