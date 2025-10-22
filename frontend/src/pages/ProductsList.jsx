import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductService from "../services/product.service";
import {BACKEND_URL} from "../helper/backendURL.js"

function ProductsList() {
    const [products, setProducts] = useState({
        products: [],
        totalPages: 0,
        currentPage: 0,
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 6);

    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchName, setSearchName] = useState(searchParams.get("name") || "");
    const [name, setName] = useState(searchParams.get("name") || "");

    useEffect(() => {
        const params = { page, limit };
        if (name) params.name = name;
        setSearchParams(params);
        retrieveProducts(page, limit, name).catch(console.error);
    }, [page, limit, name, setSearchParams]);

    const onChangeSearchName = (e) => setSearchName(e.target.value);

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(0);
    };

    const retrieveProducts = async (pageNumber, pageSize, searchNameParam) => {
        const response = await ProductService.getAll(pageNumber, pageSize, searchNameParam);
        setProducts(response.data);
    };

    const refreshList = () => {
        retrieveProducts(page, limit, name).catch(console.error);
        setCurrentProduct(null);
        setCurrentIndex(-1);
    };

    const setActiveProduct = (product, index) => {
        setCurrentProduct(product);
        setCurrentIndex(index);
    };

    const findByName = async () => {
        try {
            const response = await ProductService.findByName(searchName);
            setProducts(response.data);
            setName(searchName);
            setCurrentProduct(null);
            setCurrentIndex(-1);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < products.totalPages) setPage(newPage);
    };

    return (
        <div className="p-4">
            {/* Search and limit */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <form
                    className="flex w-full md:w-auto gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        findByName().catch(console.error);
                        setPage(0);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                        className="border border-gray-300 rounded-l px-2 py-1 w-full md:w-64"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-1 rounded-r"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <label htmlFor="limit-select">Products per page:</label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={handleLimitChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                    </select>
                </div>
            </div>

            {/* Products cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.products &&
                    products.products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`border rounded shadow hover:shadow-lg cursor-pointer p-4 flex flex-col ${
                                index === currentIndex ? "bg-blue-50" : "bg-white"
                            }`}
                            onClick={() => setActiveProduct(product, index)}
                        >
                            {product.image && (
                                <img
                                    src={BACKEND_URL + '/' + product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                            )}
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            {product.ingredients && (
                                <p className="text-gray-700 text-sm">{product.ingredients}</p>
                            )}
                            <p className="mt-auto font-semibold">
                                ${product.price}
                                {product.sale_price && (
                                    <span className="line-through text-gray-400 ml-2">
                                        ${product.sale_price}
                                    </span>
                                )}
                            </p>
                            <Link
                                to={`/products/${product.id}`}
                                className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded inline-block text-center"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    ← Prev
                </button>

                {Array.from({ length: products.totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded ${
                            page === i ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === products.totalPages - 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default ProductsList;
