import { getReviewAPI, postReviewAPI, deleteReviewAPI, updateReviewAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;

const getReview = async (drinkId, { offset, length }) => {
    try {
        const response = await Instance.get(`${API_URL}/drinks/${drinkId}/reviews?offset=${offset}&length=${length}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const postReview = async (drinkId, data) => {
    try {
        const response = await Instance.post(`${API_URL}/drinks/${drinkId}/reviews`, data);
        return response;
    } catch (error) {
        throw error;
    }
};


const deleteReview = async (drinkId, reviewId) => {
    try {
        const response = await Instance.delete(`${API_URL}/drinks/${drinkId}/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateReview = async (id, data) => {
    try {
        let response = await Instance.put(API_URL + updateReviewAPI + "/" + id, data);
        return response;
    } catch (error) {
        throw error;
    }
};

const viewReview = async (id) => {
    try {
        const response = await Instance.get(API_URL + deleteReviewAPI + "/" + id);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getReview,
    deleteReview,
    viewReview,
    postReview,
    updateReview
};