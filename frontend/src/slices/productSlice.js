import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductService from "../services/product.service";

// === ASYNC THUNKS ===

// get all common products
export const fetchCommonProducts = createAsyncThunk(
    "products/fetchCommon",
    async ({ page, limit, name }, { rejectWithValue }) => {
        try {
            const response = await ProductService.getAllCommon(page, limit, name);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// get all alcohol products
export const fetchAlcoholProducts = createAsyncThunk(
    "products/fetchAlcohol",
    async ({ page, limit, name }, { rejectWithValue }) => {
        try {
            const response = await ProductService.getAllAlcohol(page, limit, name);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// get single product
export const fetchProductById = createAsyncThunk(
    "products/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await ProductService.get(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// create product
export const createProduct = createAsyncThunk(
    "products/create",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await ProductService.create(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// update product
export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            await ProductService.update(id, formData);
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// delete product
export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id, { rejectWithValue }) => {
        try {
            await ProductService.remove(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// === SLICE ===

const initialState = {
    list: [],
    totalPages: 0,
    currentPage: 0,
    currentProduct: null,
    loading: false,
    error: null,
    message: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Common products
            .addCase(fetchCommonProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCommonProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCommonProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Alcohol products
            .addCase(fetchAlcoholProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlcoholProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchAlcoholProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Single product
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
            })

            // Create
            .addCase(createProduct.fulfilled, (state, action) => {
                state.message = "Product created successfully!";
                state.list.push(action.payload);
            })

            // Update
            .addCase(updateProduct.fulfilled, (state) => {
                state.message = "Product updated successfully!";
            })

            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.message = "Product deleted successfully!";
                state.list = state.list.filter((p) => p.id !== action.payload);
            });
    },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
