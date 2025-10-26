import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearMessage,
} from "../slices/productSlice";
import { RootState, AppDispatch } from "../store";
import { toAssetUrl } from "../helpers/url";

interface ProductForm {
    name: string;
    description: string;
    ingredients: string;
    type: "common" | "alcohol";
    price: number;
    sale_price: number;
    imageFile: File | null;
    image?: string;
}

function ProductEdit() {
    const { id } = useParams<{ id: string }>();
    const isNew = id === "0";
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { currentProduct, message } = useSelector((state: RootState) => state.products);

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        ingredients: "",
        type: "common",
        price: 0,
        sale_price: 0,
        imageFile: null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Fetch product on load if editing
    useEffect(() => {
        if (!isNew && id) dispatch(fetchProductById(id));
        else {
            dispatch(clearMessage());
            setForm({
                name: "",
                description: "",
                ingredients: "",
                type: "common",
                price: 0,
                sale_price: 0,
                imageFile: null,
            });
            setPreviewImage(null);
        }
    }, [dispatch, id, isNew]);

    // Populate form when currentProduct is loaded
    useEffect(() => {
        if (currentProduct && !isNew) {
            setForm({
                ...currentProduct,
                imageFile: null,
            });
            setPreviewImage(currentProduct.image || null);
        }
    }, [currentProduct, isNew]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "price" || name === "sale_price" ? Number(value) : value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, imageFile: file }));
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    const handleSave = () => {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key !== "imageFile" && value !== null && value !== undefined) formData.append(key, value as any);
        });
        if (form.imageFile) formData.append("image", form.imageFile);

        if (isNew) {
            dispatch(createProduct(formData)).then((res: any) => {
                if (!res.error) navigate(`/products/edit/${res.payload.id}`);
            });
        } else if (id) {
            dispatch(updateProduct({ id, formData }));
        }
    };

    const handleDelete = () => {
        if (id) dispatch(deleteProduct(id)).then(() => navigate("/products"));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <h4 className="font-bold text-2xl mb-4 text-gray-800">
                {isNew ? "Add Product" : "Edit Product"}
            </h4>

            {/* Name */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Ingredients */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Ingredients</label>
                <textarea
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Type */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Type</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                >
                    <option value="common">Common</option>
                    <option value="alcohol">Alcohol</option>
                </select>
            </div>

            {/* Prices */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block font-medium mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="flex-1">
                    <label className="block font-medium mb-1">Sale Price</label>
                    <input
                        type="number"
                        name="sale_price"
                        value={form.sale_price}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:ring focus:ring-blue-300"
                    />
                </div>
            </div>

            {/* Image */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Image</label>
                {previewImage && (
                    <img
                        src={previewImage.startsWith("blob") ? previewImage : toAssetUrl(previewImage)!}
                        alt="preview"
                        className="mb-2 w-full h-48 object-cover rounded-xl shadow"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-gray-300 rounded-lg w-full px-3 py-2"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
                {!isNew && (
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                    onClick={handleSave}
                >
                    {isNew ? "Create" : "Update"}
                </button>
            </div>

            {message && <p className="text-green-600 mt-3">{message}</p>}
        </div>
    );
}

export default ProductEdit;
