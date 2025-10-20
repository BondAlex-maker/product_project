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
        <div className="container">
            <header className="jumbotron">
                <h3>{content}</h3>
            </header>
        </div>
    );
};

export default Home;