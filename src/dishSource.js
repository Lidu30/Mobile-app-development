import { PROXY_URL, PROXY_KEY} from "./apiConfig.js";

export function searchDishes(searchParams) {
    const quesryString = new URLSearchParams(searchParams); 
    const url = `${PROXY_URL}/recipes/complexSearch?${quesryString}`;

    return fetch(url, {
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": 11,
        }
    }).then(response => response.json()).then(someACB);

    function someACB(response){
      return response.results;
    }
   
}