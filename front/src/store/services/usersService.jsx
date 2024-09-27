/** @format */
import {
	getUsersAPI,
	postUsersAPI,
	deleteUsersAPI,
	viewUsersAPI,
	getSearchUsersAPI,
	updateUsersAPI,
} from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;

const getUsers = async (params = { limit :10, page: 1, order_by, column_name }) => {
	try {
		const response = await Instance.get(API_URL + getUsersAPI, {params});
		return response.data;
	} catch (error) {
		throw error;
	}
};


const getSearchUsers = async (params = { filter:contains, value }) => {
	try {
		const response = await Instance.get(API_URL + getSearchUsersAPI, {params});
		return response.data;
	} catch (error) {
		throw error;
	}
};

const postUser = async (data) => {
	try {
		const response = await Instance.post(API_URL + postUsersAPI, data);
		return response;
	} catch (error) {
		throw error;
	}
};

const deleteUser = async (anyId) => {
	try {
		const response = await Instance.delete(API_URL + deleteUsersAPI + '/' + anyId);
		return response;
	} catch (error) {
		throw error;
	}
};

const viewUser = async (id) => {
	try {
		const response = await Instance.get(API_URL + viewUsersAPI + '/' + id);
		return response.data;
	} catch (error) {
		throw error;
	}
};

const updateUser = async (id, data) => {
	try {
		let response = await Instance.put(API_URL + updateUsersAPI + '/' + id, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export {
	getUsers,
	postUser,
	deleteUser,
	viewUser,
	getSearchUsers,
	updateUser,
};