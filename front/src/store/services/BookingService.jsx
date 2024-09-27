import { getProductAPI, postBookingsAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;



const getProduct = async () => {
    try {
        const response = await Instance.get(API_URL + getProductAPI);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const postBooking = async (data) => {
    try {
        const response = await Instance.post(API_URL + postBookingsAPI, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export {
    getProduct,
    postBooking,
};