import { useState, useEffect } from "react";
import TutorialService from "../services/tutorial.service";
import { Link } from "react-router-dom";

function TutorialsList() {
    const [tutorials, setTutorials] = useState([]);
    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        retrieveTutorials().catch(console.error);
    }, []);

    const onChangeSearchTitle = (e) => {
        setSearchTitle(e.target.value);
    };

    const retrieveTutorials = async () => {
            const response = await TutorialService.getAll();
            console.log(response.data);
            setTutorials(response.data);
    };

    const refreshList = () => {
        retrieveTutorials().catch(console.error);
        setCurrentTutorial(null);
        setCurrentIndex(-1);
    };

    const setActiveTutorial = (tutorial, index) => {
        setCurrentTutorial(tutorial);
        setCurrentIndex(index);
    };

    const removeAllTutorials = async () => {
        try {
            const response = await TutorialService.removeAll();
            console.log(response.data);
            refreshList(); // if refreshList is async
        } catch (e) {
            console.error(e);
        }
    };

    const findByTitle = async () => {
        try {
            const response = await TutorialService.findByTitle(searchTitle);
            setTutorials(response.data);
            setCurrentTutorial(null);
            setCurrentIndex(-1);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN: SEARCH + LIST */}
            <div className="flex-1">
                <div className="flex mb-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-l px-2 py-1 w-full"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={onChangeSearchTitle}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-1 rounded-r"
                        onClick={findByTitle}
                    >
                        Search
                    </button>
                </div>

                <h4 className="font-bold text-lg mb-2">Tutorials List</h4>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
                    {tutorials &&
                        tutorials.map((tutorial, index) => (
                            <li
                                className={
                                    "px-4 py-2 cursor-pointer " +
                                    (index === currentIndex ? "bg-blue-100" : "")
                                }
                                onClick={() => setActiveTutorial(tutorial, index)}
                                key={index}
                            >
                                {tutorial.title}
                            </li>
                        ))}
                </ul>

                <button
                    className="bg-red-500 text-white px-3 py-1 rounded mt-4"
                    onClick={removeAllTutorials}
                >
                    Remove All
                </button>
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="flex-1">
                {currentTutorial ? (
                    <div className="p-4 bg-white rounded shadow">
                        <h4 className="font-bold text-xl mb-2">Tutorial</h4>
                        <div className="mb-2">
                            <strong>Title: </strong>
                            {currentTutorial.title}
                        </div>
                        <div className="mb-2">
                            <strong>Description: </strong>
                            {currentTutorial.description}
                        </div>
                        <div className="mb-2">
                            <strong>Status: </strong>
                            {currentTutorial.published ? "Published" : "Pending"}
                        </div>

                        <Link
                            to={`/tutorials/${currentTutorial.id}`}
                            className="inline-block bg-yellow-400 text-black px-3 py-1 rounded"
                        >
                            Edit
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p>Please click on a Tutorial...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TutorialsList;