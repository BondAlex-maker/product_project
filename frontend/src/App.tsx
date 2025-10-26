import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  // Делаем вычисления ролей только на клиенте (после гидратации)
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
    dispatch(logout());
  }, [dispatch]);

  // (опционально) если у тебя где-то был побочный эффект ролей — оставь:
  useEffect(() => {
    // без изменения DOM до гидратации
  }, [showModeratorBoard, showAdminBoard]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          {/* Левая часть навбара */}
          <div className="flex flex-wrap items-center space-x-4">
            <Link to="/" className="font-bold text-lg hover:text-gray-200">
              Public Page
            </Link>
            <Link to="/home" className="hover:text-gray-200">
              Home
            </Link>

            {/* Ролевые пункты — только после гидратации */}
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
            {/* USER тоже зависит от авторизации */}
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

          {/* Правая часть навбара */}
          <div className="flex flex-wrap items-center space-x-4 mt-2 sm:mt-0">
            {isHydrated && currentUser ? (
              <>
                <Link to="/profile" className="hover:text-gray-200 font-medium">
                  {currentUser.username}
                </Link>
                <button
                  onClick={logOut}
                  className="hover:text-gray-200 font-medium"
                >
                  LogOut
                </button>
              </>
            ) : (
              // Пока не гидратировались — показываем гость-версию
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

      {/* ROUTES */}
      <main className="flex-1 container mx-auto mt-8 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/products/common" element={<ProductsList />} />
          <Route path="/products/alcohol" element={<ProductsList />} />
          <Route path="/products/edit/:id" element={<Product />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
