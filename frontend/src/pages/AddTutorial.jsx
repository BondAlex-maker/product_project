import React, { useState } from "react";
import TutorialService from "../services/tutorial.service";

function AddTutorial() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const saveTutorial = async () => {
        const data = { title, description };

        try {
            const response = await TutorialService.create(data);
            console.log(response.data);
            setSubmitted(true);
        } catch (e) {
            console.log(e);
        }
    };

    const newTutorial = () => {
        setTitle("");
        setDescription("");
        setSubmitted(false);
    };

    return (
        <div className="max-w-sm mx-auto p-4 bg-white rounded shadow">
            {submitted ? (
                <div>
                    <h4 className="font-bold text-green-600 mb-4">
                        Tutorial submitted successfully!
                    </h4>
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={newTutorial}
                    >
                        Add Another
                    </button>
                </div>
            ) : (
                <div>
                    <h4 className="font-bold text-xl mb-2">Add Tutorial</h4>

                    <div className="mb-2">
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded w-full px-2 py-1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block mb-1 font-medium">Description</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded w-full px-2 py-1"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                        onClick={saveTutorial}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddTutorial;