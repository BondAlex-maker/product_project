import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";
import { RootState, AppDispatch } from "../store.ts";

interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const [successful, setSuccessful] = useState(false);
    const { message } = useSelector((state: RootState) => state.message);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const initialValues: RegisterFormValues = {
        username: "",
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "The username must be between 3 and 20 characters.")
            .max(20, "The username must be between 3 and 20 characters.")
            .required("This field is required!"),
        email: Yup.string()
            .email("This is not a valid email.")
            .required("This field is required!"),
        password: Yup.string()
            .min(6, "The password must be between 6 and 40 characters.")
            .max(40, "The password must be between 6 and 40 characters.")
            .required("This field is required!"),
    });

    const handleRegister = (
        formValue: RegisterFormValues,
        { setSubmitting }: FormikHelpers<RegisterFormValues>
    ) => {
        const { username, email, password } = formValue;
        setSuccessful(false);

        dispatch(register({ username, email, password }))
            .unwrap()
            .then(() => {
                setSuccessful(true);
            })
            .catch(() => {
                setSuccessful(false);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

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
                    onSubmit={handleRegister}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-6">
                            {!successful && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="username"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Username
                                        </label>
                                        <Field
                                            id="username"
                                            name="username"
                                            type="text"
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                errors.username && touched.username
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Email
                                        </label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                errors.email && touched.email
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Password
                                        </label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                errors.password && touched.password
                                                    ? "border-red-500"
                                                    : "border-gray-300"
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
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </Formik>

                {message && (
                    <div className="mt-4">
                        <div
                            className={`px-4 py-3 rounded ${
                                successful
                                    ? "bg-green-100 border border-green-400 text-green-700"
                                    : "bg-red-100 border border-red-400 text-red-700"
                            }`}
                            role="alert"
                        >
                            {message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
