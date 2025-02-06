jest.mock("src/firestoreModel", ()=>({
    connectToPersistence: jest.fn(()=>null)
}))

jest.mock("src/DinnerModel", () => ({
    model: {
	doSearch(){}
    }
}))

import {reactiveModel} from "src/bootstrapping.js"
import {connectToPersistence} from "src/firestoreModel"
import {reaction} from "mobx";


describe("TW3.1 Persistence in bootstrapping", function tw3_1_1() {
    it(" bootstrapping calls connectToPersistence with the correct parameters", async function tw3_1_2_bootstrap(){
	expect(connectToPersistence).toHaveBeenCalledWith(reactiveModel, reaction)
    })
})

