import { PROXY_URL, PROXY_KEY, GROUP_NUMBER } from "./apiConfig.js";

async function searchDishes(searchParams) {
    const url = `${PROXY_URL}/recipes/complexSearch`

    const options = {
        method: "GET",
        headers: {
            "X-DH2642-Key": PROXY_KEY,
            "X-DH2642-Group": 11,
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}