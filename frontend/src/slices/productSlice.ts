import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ProductService, { Product } from "../services/product.service";


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

export const fetchCommonProducts = createAsyncThunk(
    "products/fetchCommon",
    async ({ page, limit, name }: FetchProductsArgs, { rejectWithValue }: any): Promise<Product[]> => {
        try {
            const response = await ProductService.getAllCommon(page, limit, name);
            return response.data.products as Product[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAlcoholProducts = createAsyncThunk(
    "products/fetchAlcohol",
    async ({ page, limit, name }: FetchProductsArgs, { rejectWithValue }: any): Promise<Product[]> => {
        try {
            const response = await ProductService.getAllAlcohol(page, limit, name);
            return response.data.products as Product[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "products/fetchById",
    async (id: number | string, { rejectWithValue }: any): Promise<Product> => {
        try {
            const response = await ProductService.get(id);
            return response.data as Product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/create",
    async (formData: FormData, { rejectWithValue }: any): Promise<Product> => {
        try {
            const response = await ProductService.create(formData);
            return response.data as Product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, formData }: UpdateProductArgs, { rejectWithValue }: any): Promise<UpdateProductArgs> => {
        try {
            await ProductService.update(id, formData);
            return { id, formData };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id: number | string, { rejectWithValue }: any): Promise<number | string> => {
        try {
            await ProductService.remove(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const initialState: ProductState = {
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
            .addCase(fetchCommonProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCommonProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCommonProducts.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAlcoholProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlcoholProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAlcoholProducts.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
                state.currentProduct = action.payload;
            })

            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.message = "Product created successfully!";
                state.list.push(action.payload);
            })

            .addCase(updateProduct.fulfilled, (state) => {
                state.message = "Product updated successfully!";
            })

            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number | string>) => {
                state.message = "Product deleted successfully!";
                state.list = state.list.filter((p) => p.id !== action.payload);
            });
    },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
