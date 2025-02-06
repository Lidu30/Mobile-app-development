import { PROXY_URL } from "src/apiConfig"

export function hash(s){ return s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0); }

// copied from Web, header name hashed...
export function checkFetch(url, headers, endPointHash, queryHash){
  //a  slash expected after the API server: 
  expect(url.indexOf(".com/")).not.toEqual(-1);

  //a single slash expected after the API server, you may have a trainling slash in your apiConfig
  expect(url.indexOf(".com//")).toEqual(-1);

  expect(headers).toBeDefined();

  //exactly two headers needed in the lab: the API key and the group number.
  //Check the lab instructions for the right header name and value, they are different from the API documentation
  expect(Object.keys(headers).length).toEqual(2);

  //should send the correct API key as a header
  expect(Object.keys(headers).find(x=> hash(x.toLowerCase())===1041508045 && hash(headers[x].toString())===-182158098)).toBeTruthy();
  expect(url).toMatch(new RegExp(`^${PROXY_URL}`));

  const groupIndex= url.indexOf("/group/");
  let group= url.substring(groupIndex+7, groupIndex+10);
  // Deal with two and three characters group, i.e. 200 vs 66
  if (group[2] == '/') {
    group = group.substring(0, 2);
  } else if (group[1] == '/') {
    group = group.substring(0, 1);
  }
  // checking that the group number is the same in the headers and in the url
  // the heder name is hashed; find the right header name in the course material
  expect(Object.keys(headers).find(x=> hash(x.toLowerCase())===158538605 && hash(headers[x].toString())===hash(group))).toBeTruthy();
  const proxiedIndex= url.indexOf("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com");
  expect(proxiedIndex).toBeGreaterThanOrEqual(1);

  const rest= url.substring(proxiedIndex+10); // skip ://
  const endpoint= rest.indexOf("/");
  const queryString= rest.indexOf("?");
  //  "group/NNN should followed by endpoint"
  expect(endpoint).toBeGreaterThanOrEqual(1)
  
  const endpointStr= (queryString==-1?rest.substring(endpoint): rest.substring(endpoint, queryString)).toLowerCase();

  // if this fails, please find a more appropriate endpoint in the API documentation
  expect(hash(endpointStr)).toEqual(endPointHash);

  let checked=false;
  if(queryString!=-1){
    const qs=rest.substring(queryString+1);
    if(qs){
      //  did not expect a query string when there are no API parameters. Note that URLSearchParams({}) will produce no query string!
      expect(Array.isArray(queryHash)).toBe(true);
      const queryParams= qs.split("&");        
      queryParams.forEach(function(y) {
        //console.log(y,hash(y));
        // unexpected query string parameter-value. It is strongly recommended to use URLSearchParams
        expect(queryHash.find(x=> hash(y)===x)).toBeTruthy();
      }
      );
      // wrong number of query string parameters
      expect(queryHash.length).toEqual(queryParams.length);
      checked=true;
    }
  }
  if(!checked && queryHash.length)
    throw new Error("expected "+queryHash.length+" query string parameters, found none");
  
}
