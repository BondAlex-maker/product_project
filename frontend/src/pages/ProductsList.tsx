import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCommonProducts, fetchAlcoholProducts } from "../slices/productSlice";
import { RootState, AppDispatch } from "../store";
import { toAssetUrl } from "../helpers/url";

interface Product {
    id: number;
    name: string;
    description?: string;
    ingredients?: string;
    type: "common" | "alcohol";
    price?: number;
    sale_price?: number;
    image?: string;
    [key: string]: any;
}

function ProductsList() {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const { list: products, totalPages, currentPage, loading } = useSelector(
        (state: RootState) => state.products
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 0);
    const [limit] = useState<number>(Number(searchParams.get("limit")) || 6);
    const [nameInput, setNameInput] = useState<string>(searchParams.get("name") || "");
    const prevPathRef = useRef(location.pathname);

    // Сбрасываем поиск при смене типа продукта
    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            setNameInput("");
            setPage(0);
            setSearchParams({ page: "0" });
        }
        prevPathRef.current = location.pathname;
    }, [location.pathname, setSearchParams]);

    // Fetch products при изменении пути, страницы или поиска
    useEffect(() => {
        const params = { page, limit, name: searchParams.get("name") || "" };
        if (location.pathname.includes("/products/alcohol")) {
            dispatch(fetchAlcoholProducts(params));
        } else {
            dispatch(fetchCommonProducts(params));
        }
    }, [dispatch, location.pathname, page, limit, searchParams]);

    const handleSearch = () => {
        setPage(0);
        setSearchParams({ name: nameInput, page: "0" });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-2xl font-bold">
                        {location.pathname.includes("/alcohol") ? "Alcohol Products" : "Common Products"}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Search..."
                            className="border rounded px-3 py-2"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-500">Loading...</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length > 0 ? (
                        products.map((product: Product) => (
                            
                            <div
                                key={product.id}
                                className="bg-white border rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
                            >
                                {product.image && (
                                    <img
                                        src={toAssetUrl(product.image)!}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-md mb-3"
                                    />
                                )}
                                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                                <p className="text-gray-600 text-sm flex-1">
                                    {product.description || "No description"}
                                </p>
                                <p className="text-gray-600 text-sm flex-1">
                                    {product.ingredients || "No ingredients"}
                                </p>
                                <p className="font-bold mt-2">
                                    {product.sale_price && product.price && product.price != 0 ? (
                                        <span className="flex flex-col">
                                            <span className="line-through text-gray-400 text-sm">
                                                ${product.price}
                                            </span>
                                            <span className="text-red-500">
                                                ${product.sale_price}
                                            </span>
                                        </span>
                                    ) : (
                                        <>${product.sale_price ?? product.price ?? 0}</>
                                    )}
                                </p>

                                {currentUser?.roles?.includes("ROLE_ADMIN") && (
                                    <Link
                                        to={`/products/edit/${product.id}`}
                                        className="mt-3 text-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-3 py-2 rounded transition"
                                    >
                                        Edit
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <p className="text-gray-500 text-center col-span-full">No products found.</p>
                        )
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`px-3 py-1 rounded ${
                                    i === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsList;
