import axios from "axios";
import getAuthHeader from "./auth-header"

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
    return axios.get(API_URL + "all");
};

const getUserBoard = () => {
    return axios.get(API_URL + "user", { headers: getAuthHeader() });
};

const getModeratorBoard = () => {
    return axios.get(API_URL + "mod", { headers: getAuthHeader() });
};

const getAdminBoard = () => {
    return axios.get(API_URL + "admin", { headers: getAuthHeader() });
};

const UserService = {
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
}

export default UserService;