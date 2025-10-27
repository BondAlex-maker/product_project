import { Routes, Route, Link, Navigate, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductsList from "./pages/ProductsList";
import Product from "./pages/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "./slices/auth";
import { RootState, AppDispatch } from "./store";
import { useHydrated } from "./hooks/useHydrated";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const isHydrated = useHydrated();
  const navigate = useNavigate();

  const { showModeratorBoard, showAdminBoard } = useMemo(() => {
    if (!isHydrated || !currentUser?.roles) {
      return { showModeratorBoard: false, showAdminBoard: false };
    }
    const roles: string[] = currentUser.roles;
    return {
      showModeratorBoard: roles.includes("ROLE_MODERATOR"),
      showAdminBoard: roles.includes("ROLE_ADMIN"),
    };
  }, [isHydrated, currentUser]);

  const logOut = useCallback(() => {
    dispatch(logout() as any)
      .finally(() => {
        navigate("/", { replace: true });
      });
  }, [dispatch, navigate]);

  useEffect(() => {
  }, [showModeratorBoard, showAdminBoard]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap items-center space-x-4">
            <Link to="/" className="font-bold text-lg hover:text-gray-200">
              Public Page
            </Link>
            <Link to="/home" className="hover:text-gray-200">
              Home
            </Link>

            {isHydrated && showModeratorBoard && (
              <Link to="/mod" className="hover:text-gray-200">
                Moderator Board
              </Link>
            )}
            {isHydrated && showAdminBoard && (
              <>
                <Link to="/admin" className="hover:text-gray-200">
                  Admin Board
                </Link>
                <Link to="/products/edit/0" className="hover:text-gray-200">
                  Add Product
                </Link>
              </>
            )}
            {isHydrated && currentUser && (
              <Link to="/user" className="hover:text-gray-200">
                User
              </Link>
            )}

            <Link to="/products/common" className="hover:text-gray-200">
              Common Jelly
            </Link>
            <Link to="/products/alcohol" className="hover:text-gray-200">
              Alcohol Jelly
            </Link>
          </div>

          <div className="flex flex-wrap items-center space-x-4 mt-2 sm:mt-0">
            {isHydrated && currentUser ? (
              <>
                <Link to="/profile" className="hover:text-gray-200 font-medium">
                  {currentUser.username}
                </Link>
                <button
                  onClick={logOut}
                  className="hover:text-gray-200 font-medium cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  LogOut
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200 font-medium">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-200 font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto mt-8 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={currentUser ? <BoardAdmin /> : <Navigate to="/login" replace />} />
            <Route path="/mod"   element={currentUser ? <BoardModerator /> : <Navigate to="/login" replace />} />
            <Route path="/user"  element={currentUser ? <BoardUser /> : <Navigate to="/login" replace />} />
            <Route path="/products/edit/:id"
                element={currentUser?.roles?.includes("ROLE_ADMIN") ? <Product /> : <Navigate to="/" replace />} />
          <Route path="/products/common" element={<ProductsList />} />
          <Route path="/products/alcohol" element={<ProductsList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
