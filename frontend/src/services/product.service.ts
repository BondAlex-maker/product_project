import api from "./api.ts";
import { AxiosResponse, AxiosRequestConfig } from "axios";

export interface Product {
    id: number;
    name: string;
    price?: number;
    [key: string]: any; // на случай других полей
}

class ProductService {
    getAllCommon(pageNumber: number, pageSize: number, searchName: string): Promise<AxiosResponse<Product[]>> {
        return api.get(`/products/common?page=${pageNumber}&size=${pageSize}&name=${searchName}`);
    }

    getAllAlcohol(pageNumber: number, pageSize: number, searchName: string): Promise<AxiosResponse<Product[]>> {
        return api.get(`/products/alcohol?page=${pageNumber}&size=${pageSize}&name=${searchName}`);
    }

    get(id: number | string): Promise<AxiosResponse<Product>> {
        return api.get(`/products/edit/${id}`);
    }

    create(data: FormData): Promise<AxiosResponse<Product>> {
        const config: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
        return api.post("/products", data, config);
    }

    update(id: number | string, data: FormData): Promise<AxiosResponse<Product>> {
        const config: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
        return api.put(`/products/${id}`, data, config);
    }

    remove(id: number | string): Promise<AxiosResponse<void>> {
        return api.delete(`/products/${id}`);
    }

    removeAll(): Promise<AxiosResponse<void>> {
        return api.delete("/products");
    }

    findByName(name: string): Promise<AxiosResponse<Product[]>> {
        return api.get(`/products?name=${name}`);
    }
}

export default new ProductService();
