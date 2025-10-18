import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TutorialService from "../services/tutorial.service";

function Tutorial() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentTutorial, setCurrentTutorial] = useState({
        id: null,
        title: "",
        description: "",
        published: false,
    });
    const [message, setMessage] = useState("");

    // 📌 Получение одного туториала
    const getTutorial = async (id) => {
        try {
            const response = await TutorialService.get(id);
            setCurrentTutorial(response.data);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (id) {
            getTutorial(id).catch(console.error);
        }
    }, [id]);

    // 📌 Обработка инпутов
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentTutorial((prev) => ({ ...prev, [name]: value }));
    };

    // 📌 Обновление статуса published
    const updatePublished = async (status) => {
        try {
            const data = { ...currentTutorial, published: status };
            const response = await TutorialService.update(currentTutorial.id, data);
            setCurrentTutorial((prev) => ({ ...prev, published: status }));
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    // 📌 Обновление туториала
    const updateTutorial = async () => {
        try {
            const response = await TutorialService.update(currentTutorial.id, currentTutorial);
            console.log(response.data);
            setMessage("The tutorial was updated successfully!");
        } catch (e) {
            console.error(e);
        }
    };

    // 📌 Удаление туториала
    const deleteTutorial = async () => {
        try {
            const response = await TutorialService.remove(currentTutorial.id);
            console.log(response.data);
            navigate("/tutorials");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            {currentTutorial ? (
                <div className="max-w-sm mx-auto p-4 bg-white rounded shadow">
                    <h4 className="font-bold text-xl mb-2">Edit Tutorial</h4>
                    <div className="mb-2">
                        <label className="block font-medium" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded w-full px-2 py-1"
                            id="title"
                            name="title"
                            value={currentTutorial.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block font-medium" htmlFor="description">
                            Description
                        </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded w-full px-2 py-1"
                            id="description"
                            name="description"
                            value={currentTutorial.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <strong>Status:</strong>{" "}
                        {currentTutorial.published ? "Published" : "Pending"}
                    </div>

                    <div className="space-x-2 mt-2">
                        {currentTutorial.published ? (
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => updatePublished(false)}
                            >
                                Unpublish
                            </button>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => updatePublished(true)}
                            >
                                Publish
                            </button>
                        )}

                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={deleteTutorial}
                        >
                            Delete
                        </button>

                        <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={updateTutorial}
                        >
                            Update
                        </button>
                    </div>

                    {message && <p className="text-green-600 mt-2">{message}</p>}
                </div>
            ) : (
                <div>
                    <p>Loading tutorial...</p>
                </div>
            )}
        </div>
    );
}

export default Tutorial;