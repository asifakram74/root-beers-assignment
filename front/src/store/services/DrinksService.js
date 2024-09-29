import { getDrinksAPI, postDrinksAPI, deleteDrinksAPI, updateDrinksAPI, getPictureAPI, deletePictureAPI, postPictureAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;

const getDrinksWithPictures = async ({ offset, length }) => {
    try {
        const response = await Instance.get(`${API_URL}${getDrinksAPI}?offset=${offset}&length=${length}`);

        const drinks = response.data.items;

        const drinksWithPictures = await Promise.all(drinks.map(async (drink) => {
            try {
                const picturesResponse = await Instance.get(`${API_URL}${getPictureAPI}/${drink.id}/pictures`);
                const pictures = picturesResponse.data.pictures;

                return { ...drink, pictures };
            } catch (error) {
                console.error(`Error fetching pictures for drink ID ${drink.id}:`, error.response ? error.response.data : error.message);
                return { ...drink, pictures: [] };
            }
        }));

        return drinksWithPictures;
    } catch (error) {
        console.error("Error fetching drinks:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const deleteDrinkWithPicture = async (id) => {
    try {
        const drinkResponse = await Instance.delete(`${API_URL}${deleteDrinksAPI}/${id}`);

        const deleteUrl = `${API_URL}${deletePictureAPI}/${id}/pictures/${id}`;
        const pictureResponse = await Instance.delete(deleteUrl);

        return { drink: drinkResponse.data, picture: pictureResponse.data };
    } catch (error) {
        console.error(`Error deleting drink or picture with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const postDrinks = async (drinkData) => {
    try {
        const response = await Instance.post(API_URL + postDrinksAPI, drinkData);
        console.log('Drink posted successfully:', response.data);
        return response;
    } catch (error) {
        console.error("Error posting drink:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const viewDrink = async (id) => {
    try {
        const response = await Instance.get(`${API_URL}${getDrinksAPI}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch drink:', error);
        throw error;
    }
};

const updateDrinks = async (id, data) => {
    try {
        let response = await Instance.put(API_URL + updateDrinksAPI + "/" + id, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export {
    getDrinksWithPictures,
    deleteDrinkWithPicture,
    postDrinks,
    viewDrink,
    updateDrinks,
};