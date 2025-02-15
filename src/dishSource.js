import { PROXY_URL, PROXY_KEY} from "./apiConfig.js";

export function searchDishes(searchParams) {
    const quesryString = new URLSearchParams(searchParams); 
    const url = `${PROXY_URL}/recipes/complexSearch?${quesryString}`;

    return fetch(url, {
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": 11,
        }
    }).then(gotResponseACB).then(someACB);

    function someACB(response){
      return response.results;
    }

    function gotResponseACB(response){
      return response.json();
    }   
}


export function getMenuDetails(ids_array){
  
  const queryString = new URLSearchParams({ ids: ids_array});
  const url = `${PROXY_URL}/recipes/informationBulk?${queryString}`;

  return fetch(url, {
    headers: {
      "X-DH2642-Key": PROXY_KEY,
      "X-DH2642-Group": 11,
    }

  }).then(gotResponseACB);
  
  function gotResponseACB(response){
    if (!response.ok){
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }
    return response.json();
  }

}