import {Routes, Route, Link, BrowserRouter} from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductsList from "./pages/ProductsList.jsx";
import Product from "./pages/Product.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import BoardUser from "./components/BoardUser.jsx";
import BoardModerator from "./components/BoardModerator.jsx";
import BoardAdmin from "./components/BoardAdmin.jsx";

import { logout } from "./slices/auth";


function App() {
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) {
            setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
            setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
        } else {
            setShowModeratorBoard(false);
            setShowAdminBoard(false);
        }
    }, [currentUser]);
    return (
        <BrowserRouter>
            <div>
                {/* NAVBAR */}
                <nav className="bg-blue-600 p-4 text-white">
                    <div className="flex space-x-4">
                        <Link to={"/"} className="navbar-brand">
                            Public Page
                        </Link>
                        <div className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to={"/home"} className="nav-link">
                                    Home
                                </Link>
                            </li>

                            {showModeratorBoard && (
                                <li className="nav-item">
                                    <Link to={"/mod"} className="nav-link">
                                        Moderator Board
                                    </Link>
                                </li>
                            )}

                            {showAdminBoard && (
                                <>
                                    <li className="nav-item">
                                        <Link to={"/admin"} className="nav-link">
                                            Admin Board
                                        </Link>
                                    </li>
                                </>
                            )}

                            {currentUser && (
                                <li className="nav-item">
                                    <Link to={"/user"} className="nav-link">
                                        User
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link to="/products/common" className="hover:text-gray-300">
                                    Common Jelly
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products/alcohol" className="hover:text-gray-300">
                                    Alcohol Jelly
                                </Link>
                            </li>
                            {showAdminBoard && (
                                <li className="nav-item">
                                    <Link to="/products/0" className="hover:text-gray-300">
                                        Add
                                    </Link>
                                </li>
                            )}
                        </div>

                        {currentUser ? (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/profile"} className="nav-link">
                                    {currentUser.username}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a href="/login" className="nav-link" onClick={logOut}>
                                        LogOut
                                    </a>
                                </li>
                            </div>
                        ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to={"/register"} className="nav-link">
                                        Sign Up
                                    </Link>
                                </li>
                            </div>
                        )}
                    </div>
                </nav>

                {/* ROUTES */}
                <div className="container mx-auto mt-8 px-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/user" element={<BoardUser />} />
                        <Route path="/mod" element={<BoardModerator />} />
                        <Route path="/admin" element={<BoardAdmin />} />
                        {/*<Route path="/" element={<TutorialsList />} />*/}
                        <Route path="/products/common" element={<ProductsList />} />
                        <Route path="/products/alcohol" element={<ProductsList />} />
                        <Route path="/products/edit/:id" element={<Product />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;