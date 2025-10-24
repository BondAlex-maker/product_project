import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store.ts";

// Тип для пользователя
interface User {
    id: number | string;
    username: string;
    email: string;
    roles: string[];
}

const Profile: React.FC = () => {
    const currentUser = useSelector<RootState, User | null>(
        (state) => state.auth.user
    );

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <header className="mb-6">
                <h3 className="text-2xl font-bold">
                    <strong>{currentUser.username}</strong> Profile
                </h3>
            </header>

            <p className="mb-2">
                <strong>Id:</strong> {currentUser.id}
            </p>
            <p className="mb-2">
                <strong>Email:</strong> {currentUser.email}
            </p>

            <div className="mt-4">
                <strong>Authorities:</strong>
                <ul className="list-disc list-inside mt-2">
                    {currentUser.roles.map((role, index) => (
                        <li key={index} className="ml-2">
                            {role}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
