import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ProductService, { Product } from "../services/ProductService";

// === TYPES ===

interface ProductState {
    list: Product[];
    totalPages: number;
    currentPage: number;
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
    message: string | null;
}

interface FetchProductsArgs {
    page: number;
    limit: number;
    name: string;
}

interface UpdateProductArgs {
    id: number | string;
    formData: FormData;
}

// === ASYNC THUNKS ===

// get all common products
export const fetchCommonProducts = createAsyncThunk<Product[], FetchProductsArgs, { rejectValue: string }>(
    "products/fetchCommon",
        async ({ page, limit, name }, { rejectWithValue }) => {
            try {
                const response = await ProductService.getAllCommon(page, limit, name);
                return response.data.products as Product[];
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// get all alcohol products
export const fetchAlcoholProducts = createAsyncThunk<Product[], FetchProductsArgs, { rejectValue: string }>(
    "products/fetchAlcohol",
        async ({ page, limit, name }, { rejectWithValue }) => {
            try {
                const response = await ProductService.getAllAlcohol(page, limit, name);
                return response.data.products as Product[];
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// get single product
export const fetchProductById = createAsyncThunk<Product, number | string, { rejectValue: string }>(
    "products/fetchById",
        async (id, { rejectWithValue }) => {
            try {
                const response = await ProductService.get(id);
                return response.data as Product;
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// create product
export const createProduct = createAsyncThunk<Product, FormData, { rejectValue: string }>(
    "products/create",
        async (formData, { rejectWithValue }) => {
            try {
                const response = await ProductService.create(formData);
                return response.data as Product;
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// update product
export const updateProduct = createAsyncThunk<UpdateProductArgs, UpdateProductArgs, { rejectValue: string }>(
    "products/update",
        async ({ id, formData }, { rejectWithValue }) => {
            try {
                await ProductService.update(id, formData);
                return { id, formData };
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// delete product
export const deleteProduct = createAsyncThunk<number | string, number | string, { rejectValue: string }>(
    "products/delete",
        async (id, { rejectWithValue }) => {
            try {
                await ProductService.remove(id);
                return id;
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
        }
);

// === INITIAL STATE ===

const initialState: ProductState = {
    list: [],
    totalPages: 0,
    currentPage: 0,
    currentProduct: null,
    loading: false,
    error: null,
    message: null,
};

// === SLICE ===

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
            .addCase(fetchCommonProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCommonProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Alcohol products
            .addCase(fetchAlcoholProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlcoholProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAlcoholProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Single product
            .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
                state.currentProduct = action.payload;
            })

            // Create
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.message = "Product created successfully!";
                state.list.push(action.payload);
            })

            // Update
            .addCase(updateProduct.fulfilled, (state) => {
                state.message = "Product updated successfully!";
            })

            // Delete
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number | string>) => {
                state.message = "Product deleted successfully!";
                state.list = state.list.filter((p) => p.id !== action.payload);
            });
    },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
