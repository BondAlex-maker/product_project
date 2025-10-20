import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = async (username, email, password) => {
    const response = await axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
    return response.data;
};

const login = async (username, password) => {
    const response = await axios.post(API_URL + "signin", {
        username,
        password,
    });

    if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
};

const logout = async () => {
    localStorage.removeItem("user");
    const response = await axios.post(API_URL + "signout");
    return response.data;
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
