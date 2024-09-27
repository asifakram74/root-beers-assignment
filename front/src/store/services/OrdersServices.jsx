import { getBookingsAPI, viewBookingsAPI, updateBookingsAPI, getMyBookingsAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;



const getBookings = async (params = { limit :10, page: 1, order_by, column_name }) => {
    try {
        const response = await Instance.get(API_URL + getBookingsAPI , {params});
        return response.data;
    } catch (error) {
        throw error;
    }
};

const viewBooking = async (id) => {
    try {
        const response = await Instance.get(API_URL + viewBookingsAPI + "/" + id);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateBooking = async (id, data) => {
    try {
        const response = await Instance.put(API_URL + updateBookingsAPI + "/" + id, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getMyBookings = async (params = { limit :10, page: 1, order_by, column_name }) => {
    try {
        const response = await Instance.get(API_URL + getMyBookingsAPI, {params});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getBookings,
    viewBooking,
    updateBooking,
    getMyBookings
};