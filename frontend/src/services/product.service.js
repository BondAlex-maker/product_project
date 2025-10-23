import api from './api';

class ProductService {
    // getAll(pageNumber, pageSize, searchName) {
    //     return api.get(`/products?page=${pageNumber}&size=${pageSize}&name=${searchName}`);
    // }

    getAllCommon(pageNumber, pageSize, searchName) {
        return api.get(`/products/common?page=${pageNumber}&size=${pageSize}&name=${searchName}`);
    }

    getAllAlcohol(pageNumber, pageSize, searchName) {
        return api.get(`/products/alcohol?page=${pageNumber}&size=${pageSize}&name=${searchName}`);
    }

    get(id) {
        return api.get(`/products/edit/${id}`);
    }

    create = (data) => {
        return api.post("/products", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    update = (id, data) => {
        return api.put(`/products/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    remove(id) {
        return api.delete(`/products/${id}`);
    }

    removeAll() {
        return api.delete("/products");
    }

    findByName(name) {
        return api.get(`/products?name=${name}`);
    }
}

export default new ProductService();
