import api from "./api";
import { AxiosResponse } from "axios";

export interface PublicContent {
    message: string;
    [key: string]: any;
}

class UserService {
    getPublicContent(): Promise<AxiosResponse<PublicContent>> {
    return api.get("/test/all");
}

getUserBoard(): Promise<AxiosResponse<PublicContent>> {
    return api.get("/test/user");
}

getModeratorBoard(): Promise<AxiosResponse<PublicContent>> {
    return api.get("/test/mod");
}

getAdminBoard(): Promise<AxiosResponse<PublicContent>> {
    return api.get("/test/admin");
}
}

export default new UserService();
