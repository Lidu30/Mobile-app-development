const mockDB={};

function getFirestore1(){
    return mockDB;
}

const state={
    refHistory:[],
    getHistory:[],
    setHistory:[],
    onHistory:[],
    data:null,
    onACB:null,
};


function initDB(persistencePropNames, arr){    // returns false if initialization fails
    if(!persistencePropNames) return false;
    // we make a best effort to initialize some data
    const {numberOfGuests, dishes, currentDishId}= persistencePropNames;
    if(!(numberOfGuests && dishes && currentDishId))
        return false;
    state.data={
        [numberOfGuests]:arr? arr[0] : 13,
        [dishes]:arr? arr[1] :[ {id:45}, {id:42}, {id:22}],
        [currentDishId]: arr? arr[2]: 42
    };
    return true;
}

    
function doc1(db, collection, path){
    state.refHistory.push({db, collection, path});
    return {db, collection, path};
}

function getDoc1(rf){
  if(state.mustThrow){
    state.promise=Promise.reject("simulated getDoc() promise error");
    return state.promise;
  }
    state.getHistory.push({ref:rf, modelready:state.model?.ready});
    const ret= {
        data(){ return state.data; }
    };
    return state.promise= Promise.resolve(ret);
}

function setDoc1(rf, val, opts){
    state.setHistory.push({ref:rf, val, opts});
    if(opts.merge){
        if(!state.data)
            state.data={};
        Object.assign(state.data, val);
    }
    else
        state.data= val;
}
/*
function onValue(rf, acb){
    state.onACB= acb;
    state.onHistory.push({ref:rf, acb});
    //acb(state.data);
}*/

const x=  {getFirestore:getFirestore1, doc:doc1, getDoc:getDoc1, setDoc:setDoc1}

const { getFirestore, doc, setDoc, getDoc, updateDoc} =x;

export  {getFirestore, doc, setDoc, getDoc, updateDoc};

export { initDB, state}
        //onValue

