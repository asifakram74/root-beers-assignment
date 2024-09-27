import { getProductAPI, deleteProductAPI, viewProductAPI, postProductAPI, updateProductAPI } from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;



const getProduct = async (params = { limit :10, page: 1, order_by, column_name }) => {
    try {
        const response = await Instance.get(API_URL + getProductAPI , {params});
        return response.data;
    } catch (error) {
        throw error;
    }
};

const postProduct = async (data) => {
    try {
        const response = await Instance.post(API_URL + postProductAPI, data);
        return response;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id, data) => {
    try {
        let response = await Instance.put(API_URL + updateProductAPI + "/" + id, data);
        return response;
    } catch (error) {
        throw error;
    }
};
const deleteProduct = async (id) => {
    try {
        const response = await Instance.delete(API_URL + deleteProductAPI + "/" + id);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const viewProduct = async (id) => {
    try {
        const response = await Instance.get(API_URL + viewProductAPI + "/" + id);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export {
    getProduct,
    deleteProduct,
    viewProduct,
    postProduct,
    updateProduct

};