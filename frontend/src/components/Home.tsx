import React, { useState, useEffect } from "react";
import UserService from "../services/user.service.ts";

const Home: React.FC = () => {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await UserService.getPublicContent();
                // Тип response.data зависит от того, что возвращает сервер
                setContent(response.data as string);
            } catch (error: any) {
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
