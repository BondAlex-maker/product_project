import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";
import {BACKEND_URL} from "../helper/backendURL.js"

function ProductEdit() {
    const { id } = useParams(); // id может быть "0" для нового продукта
    const navigate = useNavigate();

    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        name: "",
        description: "",
        ingredients: "",
        image: "",
        type: "common",
        price: 0,
        sale_price: 0,
    });

    const [message, setMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    // 📌 Получение продукта, если id != 0
    const getProduct = async (id) => {
        try {
            if (id === "0") return; // новый продукт — не запрашиваем
            const response = await ProductService.get(id);
            setCurrentProduct(response.data);
            setPreviewImage(response.data.image || null);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getProduct(id).catch(console.error);
    }, [id]);

    // 📌 Изменение полей
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    };

    // 📌 Выбор изображения
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file)); // для показа превью
            setCurrentProduct((prev) => ({ ...prev, imageFile: file })); // сохраняем файл
        }
    };


    // 📌 Create или Update
    const saveProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("name", currentProduct.name);
            formData.append("description", currentProduct.description);
            formData.append("ingredients", currentProduct.ingredients);
            formData.append("type", currentProduct.type);
            formData.append("price", currentProduct.price);
            formData.append("sale_price", currentProduct.sale_price);

            if (currentProduct.imageFile) {
                formData.append("image", currentProduct.imageFile);
            }

            if (isNew) {
                const response = await ProductService.create(formData);
                console.log(response.data);
                setMessage("The product was created successfully!");
                navigate(`/products/${response.data.id}`);
            } else {
                await ProductService.update(currentProduct.id, formData);
                setMessage("The product was updated successfully!");
            }
        } catch (e) {
            console.error(e);
        }
    };


    // 📌 Delete (только для существующего продукта)
    const deleteProduct = async () => {
        try {
            await ProductService.remove(currentProduct.id);
            navigate("/products");
        } catch (e) {
            console.error(e);
        }
    };

    const isNew = id === "0";

    return (
        <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
            <h4 className="font-bold text-xl mb-4">
                {isNew ? "Add Product" : "Edit Product"}
            </h4>

            <div className="mb-2">
                <label className="block font-medium" htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                />
            </div>

            <div className="mb-2">
                <label className="block font-medium" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                />
            </div>

            <div className="mb-2">
                <label className="block font-medium" htmlFor="ingredients">Ingredients</label>
                <textarea
                    id="ingredients"
                    name="ingredients"
                    value={currentProduct.ingredients}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                />
            </div>

            <div className="mb-2">
                <label className="block font-medium" htmlFor="type">Type</label>
                <select
                    id="type"
                    name="type"
                    value={currentProduct.type}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                >
                    <option value="common">Common</option>
                    <option value="alcohol">Alcohol</option>
                </select>
            </div>

            <div className="mb-2 flex gap-2">
                <div className="flex-1">
                    <label className="block font-medium" htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded w-full px-2 py-1"
                    />
                </div>
                <div className="flex-1">
                    <label className="block font-medium" htmlFor="sale_price">Sale Price</label>
                    <input
                        type="number"
                        id="sale_price"
                        name="sale_price"
                        value={currentProduct.sale_price}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded w-full px-2 py-1"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-medium">Image</label>
                {previewImage && (
                    <img
                        src={previewImage.startsWith('blob') ? previewImage : `${BACKEND_URL}/${previewImage}`}
                        alt="preview"
                        className="mb-2 w-full h-40 object-cover rounded"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                />
            </div>

            <div className="space-x-2 mt-2">
                {!isNew && (
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={deleteProduct}
                    >
                        Delete
                    </button>
                )}

                <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={saveProduct}
                >
                    {isNew ? "Create" : "Update"}
                </button>
            </div>

            {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>
    );
}

export default ProductEdit;
