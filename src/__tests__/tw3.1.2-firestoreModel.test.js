import {connectToPersistence} from "src/firestoreModel"
import {reaction} from "mobx";
import {checkCB, checkPromiseCB, recordPromiseCB, stopPromiseRecording} from "./utils/checkCB"

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => null),
}))

jest.mock("firebase/firestore", ()=>    jest.requireActual('./mocks/mockFirestore'));

import {initDB, state} from "./mocks/mockFirestore"
          
jest.mock("src/DinnerModel", () => ({
    model: {
        doSearch(){}
    }
}))

function findPersistencePropNames(){
    connectToPersistence({numberOfGuests: 42, dishes:[{id:44}, {id:43}], currentDishId:45, ready:true}, function(a, b){b()});
    const data= state.data;
    const dataKeys= Object.keys(data);

    //persisted object should have three properties
    expect(dataKeys.length).toEqual(3)
    const guests= dataKeys.find(x=> data[x]==42);
    const current= dataKeys.find(x=> data[x]==45);
    const dishes= dataKeys.find(x=> Array.isArray(data[x]));

    //a property must exist for 'number of guests' and have the correct value
    expect(guests).toBeTruthy();
    
    //a property must exist for 'current dish' and have the correct value
    expect(current).toBeTruthy();

    //a property must exist for 'dishes' and have the correct value
    expect(dishes).toBeTruthy();

    //each dish should be included in the peristed data
    expect(data[dishes]).toEqual(expect.arrayContaining([{id:43}, {id:44}]));
    return {numberOfGuests: guests, dishes: dishes, currentDishId: current};
}

describe("TW3.1 Firestore persistence", function tw3_1_1() {

    it("connectToPersistence installs a side effect that persists the model",function tw3_1_1_1(){
        const model= { dishes:[{id: 45}, {id:42}, {id:22}], numberOfGuests:3, ready:true};
        let rdy;
        let check, save;
        let returnCalled;
        
        connectToPersistence(model, function(acb1, acb2) {
            check=acb1; save= acb2;
            return function(){ returnCalled= true;};
        });
        // first side-effect argument must be a function (callback)
        expect(typeof check).toBe('function');
        // second side-effect argument must be a function (callback)
        expect(typeof save).toBe('function');

        let base;
        try{
            base=check();
        }catch(e){
            throw new Error("runtime error in the first side-effect ACB: "+e.toString());
        }
        //the first side-effect ACB should return a value to check
        expect(base).toBeTruthy();

        //function returned by the side effect must not be called, as that cancels the effect
        expect(returnCalled).toBeFalsy()

        //the first ACB passed to the side-effect should always return a defined value
        model.numberOfGuests= 12;
        const base_guests= check();
        
        expect(base_guests).toBeTruthy()

        model.dishes= model.dishes.slice(1);
        const base_dishes= check();
        expect(base_dishes).toBeTruthy()

        model.currentDishId= 42;
        const base_current= check();
        expect(base_current).toBeTruthy()

        //the first ACB passed to the side-effect should return a different object/array whenever there is a change in model nr guests, dish array or currentDishId

        // deep equal ok for now
        expect(base).not.toEqual(base_guests);
        expect(base).not.toEqual(base_dishes);
        expect(base).not.toEqual(base_current);
        expect(base_guests).not.toEqual(base_dishes);
        expect(base_guests).not.toEqual(base_current);
        expect(base_dishes).not.toEqual(base_current);

        
        initDB(findPersistencePropNames());
        //second ACB passed to the side-effect performs a firestore setDoc() operation
        expect(state.setHistory.length).toEqual(1);
        
        //setDoc should be used with the merge option"
        expect(state.setHistory[0].opts).toEqual({merge:true});

        const x= checkCB(check, "first persistence side effect callback");
        const y= checkCB(save, "second persistence side effect callback");

        //persistence side effect callbacks have different names
        expect(x).not.toEqual(y); 
    });

    it("writing to persistence only when model.ready is true", async function tw_3_1_1_2(){
        const {numberOfGuests, dishes, currentDishId}=findPersistencePropNames();
        const model= {numberOfGuests:5, dishes:[{id:24}, {id:42}], currentDishId:24, ready:true};
        state.setHistory=[];
        connectToPersistence(model,function(a, b){b();} );

        //connectToPersistence side effect persists when model.ready is true
        expect(state.setHistory.length).toEqual(1);
        await state.promise;

        model.ready=false;
        state.setHistory=[];
        state.getHistory=[];
        connectToPersistence(model, function(a, b){b();} );

        //if model.ready is false, nothing is written to the cloud
        expect(state.setHistory.length).toEqual(0);
    });


    it("model read correctly from persistence, and model.ready is false while reading", async function tw3_1_1_1(){
        const {numberOfGuests, dishes, currentDishId}=findPersistencePropNames();
        const model=  {    dishes:[]        };
        initDB({numberOfGuests, dishes, currentDishId}, [32, [{id:42}, {id:49}],22]);
        state.getHistory=[];
        state.setHistory=[];
        let save;
        recordPromiseCB();
        
        try{
            connectToPersistence(model, function(a, b){ save= b;});
        }finally{
            stopPromiseRecording();
        }
        
        checkPromiseCB("getDoc");
        //model.ready is set to false before initiating the promise to read from persistence"
        expect(model.ready).toEqual(false);

        //a reading from persistence is initiated
        expect(state.getHistory.length).toEqual(1);

        //"no writing to persistence is initiated if the side effect does not fire"
        expect(state.setHistory.length).toEqual(0);
        
        const readRef= state.getHistory[0].ref;
        
        await state.promise;
        const modelReadyAfterResolve= model.ready;

        // this was checked in previous tests but still
        expect(typeof save).toBe("function");
        
        model.ready=false;        
        save();

        //no writing to persistence is initiated from side effefct if model.ready is false
        expect(state.setHistory.length).toEqual(0);

        model.ready=true;
        save();
        // this was checked in previous tests but still

        //writing to persistence is initiated from side effefct if model.ready is true
        expect(state.setHistory.length).toEqual(1);

        // getDoc and setDoc use the same firestore document
        expect(state.setHistory[0].ref).toEqual(readRef);

        // checking data
        //the current dish set in the model should be the same as in the cloud
        expect(model.currentDishId).toEqual(22);

        //the number of guests set in the model should be the same as in the cloud
        expect(model.numberOfGuests).toEqual(32);

        //persistenceToModel populates the dishes array in the model
        //the dishes set in the model should be the ones from the cloud
        expect(model.dishes).toEqual([{id:42}, {id:49}]);

        // checking model.ready at the end though we know it since after the promise has resolved
        //model.ready is set to true after the promise to read from persistence resolves
        expect(modelReadyAfterResolve).toEqual(true);

      state.mustThrow=true;
       // this will throw if there's no catch in the getDoc promise chain
       connectToPersistence({}, function(){});       
       await new Promise(r=> setTimeout(r));
       state.mustThrow=false;
    });

    it("model initialized correctly when (some) data is missing from the cloud", async function tw3_1_1_3(){
        const {numberOfGuests, dishes, currentDishId}=findPersistencePropNames();
        
        const model=  {
            dishes:[]
        };
        
        const noDishModel={...model};

        initDB(findPersistencePropNames(), [7,,21]);  // no dishes!
        connectToPersistence(noDishModel, function(a, b){});
        await state.promise;

        //the current dish set in the model should be the same as in the cloud
        expect(noDishModel.currentDishId).toEqual(21);

        //the number of guests set in the model should be the same as in the cloud
        expect(noDishModel.numberOfGuests).toEqual(7);

        // when there are no dishes in the cloud, the model dishes should be an empty array
        expect(noDishModel.dishes).toEqual([]);

        const model2=  {
            dishes:[]
        };
        
        initDB(findPersistencePropNames(), []);
        connectToPersistence(model2, function(a, b){});
        await state.promise;

        // if there is no data in the cloud, currentDishId should be set to null or not defined
        expect(model2.currentDishId).toBeFalsy();

        //if there is no data in the cloud, number of guests should be set to 2
        expect(model2.numberOfGuests).toBe(2);

        //if there is no data in the cloud, the model dishes should be set to an empty array
        expect(model2.dishes.map(d=>d.id)).toEqual([])
    });

    /*

    // we do not test root in native yet
    
        it("Root displays app if the model is ready", async function tw3_1_2_modelready(){
 
        });
*/

});
