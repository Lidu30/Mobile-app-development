function hash(s){ return s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0); }
const standard= " must follow course code conventions regarding callbacks: ";

function checkFuncName(f, description) { return checkFuncNameH(f, description, 64608); }
function checkFuncNamn(f, description) { return checkFuncNameH(f, description, 2143); }

function checkFuncNameH(f, description, hashCode){
    if(typeof f !=="function")
        return {
            pass:false,
            message(){ return description+ standard+" callbacks must be functions";}
        };
    if(!f.toString().match(/function(.*?)\(/)[0]){
        return {
           pass:false,
           message(){ return description+ standard+" have a name. Thick Arrow functions cannot have a name";}
        };
    }
    const name= f.toString().match(/function(.*?)\(/)[1].trim();
    if(!name.length>6)
        return {
            pass:false,
            message(){ return  description+ standard+name+" . Must have a descriptive name"; }
        };
    const cbacb=" . Must have a name that ends in CB or ACB depending on whether the callback is asyncrhonous or not";
    if(hash(name.slice(-3+hashCode%2))!==hashCode)
        return {
            pass:false,
            message(){ return description+ standard+name+cbacb; }
        };
    if(hashCode%2 && hash(name.slice(-2-hashCode%2))==64608)
        return {
            pass:false,
            message(){return description+ standard+name+cbacb; }
        };
    return {
        pass:true
    };
}

expect.extend({checkFuncName, checkFuncNamn});

export function checkCB(f, description){
    expect(f).toEqual(expect.checkFuncName(description + standard))

    return f.toString().match(/function(.*?)\(/)[1].trim();
}

export const cbHistory=[];
export function stopRecording(){
    Array.prototype.sort=oldSort;
    Array.prototype.map=oldMap;
    Array.prototype.filter=oldFilter;
    Array.prototype.reduce=oldReduce;
    state.last= [...cbHistory];
    cbHistory.splice(0);
}

export function checkArrayCB(description){
    if(cbHistory.length)
        stopRecording();
    const top= state.last[0];
    //"You are using the wrong array operation"
    expect(state.op).toEqual(top.op);
    expect(top.cb).toEqual(expect.checkFuncNamn("callback passed to "+state.op+"() for "+description));
    return toString().match(/function(.*?)\(/)[1].trim();
}


const oldSort=Array.prototype.sort;
const oldFilter= Array.prototype.filter;
const oldReduce= Array.prototype.reduce;
const oldMap= Array.prototype.map;

const state={};
export function recordArrayCB(x){
    state.op=x;
    if(x=="sort")  // we assume that Array.prototype.sort === oldSort
        Array.prototype.sort= function(f){
            cbHistory.push({op:"sort", cb:f});
            return oldSort.bind(this)(f);
        };
    if(x=="filter")
        Array.prototype.filter= function(f){
            cbHistory.push({op:"filter", cb:f});
            return oldFilter.bind(this)(f);
        };
    
    if(x==="map"){
        Array.prototype.map= function(f){
            cbHistory.push({op:"map", cb:f});
            return oldMap.bind(this)(f);
        };
    }
    if(x==="reduce")
        Array.prototype.reduce= function(f,x){
            cbHistory.push({op:"reduce", cb:f});
            return oldReduce.bind(this)(f,x);
        };
}

const oldThen= Promise.prototype.then;
const oldCatch= Promise.prototype.catch;
const promiseCbState={};

const promiseCbHistory=[];
export function recordPromiseCB(){
    Promise.prototype.then= function(f){
        promiseCbHistory.push({op:"then", cb:f});
        return oldThen.bind(this)(f);
    };
    Promise.prototype.catch= function(f){
        promiseCbHistory.push({op:"catch", cb:f});
        return oldCatch.bind(this)(f);
    };
}

export function stopPromiseRecording(){
    Promise.prototype.then= oldThen;
    Promise.prototype.catch= oldCatch;
    promiseCbState.last= [...promiseCbHistory];
    promiseCbHistory.splice(0);
}

export function checkPromiseCB(description){
    if(promiseCbHistory.length)
        stopPromiseRecording();
    let stop=false;
    promiseCbState.last.forEach(function eachCB(x){
        if(stop)
            return;
        if(x.cb?.toString().indexOf("_next")!=-1)
            stop=true;
        else
        checkCB(x.cb, "callback passed to "+x.op+"() for "+description);
    });
}
