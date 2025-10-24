import React, { useState, useEffect } from "react";
import UserService from "../services/user.service.ts";

const BoardUser = () => {
    const [content, setContent] = useState<string>("User");

    useEffect(() => {
        const fetchUserBoard = async () => {
            try {
                const response = await UserService.getUserBoard();
                setContent(response.data as string);
            } catch (error) {
                const _content =
                    error?.response?.data?.message ||
                    error?.message ||
                    error.toString();
                setContent(_content);
            }
        };

        fetchUserBoard();
    }, []);

    return (
        <div className="mx-auto px-4 max-w-4xl">
            <header className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold">{content}</h3>
            </header>
        </div>
    );
};

export default BoardUser;
