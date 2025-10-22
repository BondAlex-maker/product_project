import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

const Home = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await UserService.getPublicContent();
                setContent(response.data);
            } catch (error) {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                setContent(_content);
            }
        };

        fetchContent().catch(console.error);
    }, []);

    return (
        <div className="mx-auto px-4 max-w-4xl">
            <header className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold">{content}</h3>
            </header>
        </div>
    );
};

export default Home;