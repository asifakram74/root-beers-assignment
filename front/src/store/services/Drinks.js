import { getDrinksAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;

const getDrinks = async () => {
    try {
        const response = await Instance.get(API_URL + getDrinksAPI);
        console.log('drinks', response);
        
        // Assuming the API returns data in 'response.data.items'
        return response.data.items;
    } catch (error) {
        throw error;
    }
};

export {
    getDrinks,
};