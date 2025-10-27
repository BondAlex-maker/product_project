import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { login } from "../slices/auth";
import { clearMessage } from "../slices/message";
import { RootState, AppDispatch } from "../store.ts";

interface LoginForm {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(false);

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const message = useSelector((state: RootState) => state.message.message);

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const initialValues: LoginForm = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("This field is required!"),
        password: Yup.string().required("This field is required!"),
    });

    const handleLogin = (formValue: LoginForm) => {
        const { username, password } = formValue;
        setLoading(true);

        dispatch(login({ username, password }))
            .unwrap()
            .then(() => {
                navigate("/profile");
                window.location.reload();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    if (isLoggedIn) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="w-full max-w-md mx-auto mt-10">
            <div className="bg-white shadow-md rounded-lg p-8">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="w-24 h-24 mx-auto rounded-full mb-6"
                />

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                                    Username
                                </label>
                                <Field
                                    name="username"
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        errors.username && touched.username ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        errors.password && touched.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    {loading && (
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {message && (
                    <div className="mt-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                            {message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
