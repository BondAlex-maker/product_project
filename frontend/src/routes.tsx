// frontend/src/routes.tsx
import { useEffect } from "react";
import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { useSelector, useStore } from "react-redux";

// Твои страницы/компоненты
import ProductsList from "./pages/ProductsList";
import Product from "./pages/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import type { RootState } from "./store";
import setupInterceptors from "./services/setupInterceptors";
import { hydrateAuthFromStorage } from "./slices/auth";
import type { AppDispatch } from "./store";


type Role = "ROLE_USER" | "ROLE_MODERATOR" | "ROLE_ADMIN";

function selectCurrentUser(state: RootState) {
  return state.auth?.user ?? null;
}

function hasRole(user: any, roles: Role[]) {
  const userRoles: string[] = user?.roles ?? [];
  return roles.some((r) => userRoles.includes(r));
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useSelector(selectCurrentUser);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RequireRoles({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (!hasRole(user, roles)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function InterceptorsBootstrap() {
  const store = useStore();
  useEffect(() => {

    setupInterceptors(store as any);
    (store as any as { dispatch: AppDispatch }).dispatch(hydrateAuthFromStorage());
  }, [store]);
  return null;
}

// ====== Описание роутов ======

/**
 * Вынесено в функцию, чтобы можно было переиспользовать и для браузера, и для SSR.
 * Здесь же накидываем guards.
 */
export function buildRoutes(): RouteObject[] {
  return [
    // Публичные
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    // Профиль — требует авторизацию (ROLE_USER достаточна, но тут просто любой авторизованный)
    {
      path: "/profile",
      element: (
        <RequireAuth>
          <Profile />
        </RequireAuth>
      ),
    },

    // Доступные всем каталоги продуктов (контент фильтруется в компонентах)
    { path: "/products/common", element: <ProductsList /> },
    { path: "/products/alcohol", element: <ProductsList /> },

    // Роуты, требующие ролей:
    {
      path: "/user",
      element: (
        <RequireRoles roles={["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]}>
          <BoardUser />
        </RequireRoles>
      ),
    },
    {
      path: "/mod",
      element: (
        <RequireRoles roles={["ROLE_MODERATOR", "ROLE_ADMIN"]}>
          <BoardModerator />
        </RequireRoles>
      ),
    },
    {
      path: "/admin",
      element: (
        <RequireRoles roles={["ROLE_ADMIN"]}>
          <BoardAdmin />
        </RequireRoles>
      ),
    },
    {
      path: "/products/edit/:id",
      element: (
        <RequireRoles roles={["ROLE_ADMIN"]}>
          <Product />
        </RequireRoles>
      ),
    },

    // Фоллбек
    { path: "*", element: <Navigate to="/" replace /> },
  ];
}

// ====== Создание роутеров под разные среды ======

/**
 * Браузерный роутер — использовать в entry-client.tsx
 */
export function getBrowserRouter() {
  return createBrowserRouter(buildRoutes());
}

/**
 * Памятный роутер для SSR — использовать в entry-server.tsx
 */
export function getMemoryRouter(url: string) {
  return createMemoryRouter(buildRoutes(), { initialEntries: [url] });
}

/**
 * Удобный компонент, который:
 *  1) Создаёт нужный роутер под среду
 *  2) Подключает InterceptorsBootstrap
 *
 * Пример использования:
 *  - Клиент: <AppRoutes />
 *  - Сервер: <AppRoutes isServer url={req.originalUrl} />
 */
export function AppRoutes({
  isServer = false,
  url = "/",
}: {
  isServer?: boolean;
  url?: string;
}) {
  const router = isServer ? getMemoryRouter(url) : getBrowserRouter();
  return (
    <>
      <InterceptorsBootstrap />
      <RouterProvider router={router} />
    </>
  );
}
