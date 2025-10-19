import { useState, useEffect } from "react";
import TutorialService from "../services/tutorial.service";
import { Link } from "react-router-dom";

function TutorialsList() {
    const [tutorials, setTutorials] = useState({
        tutorials: [],
        totalPages: 0,
        currentPage: 0,
    });
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchTitle, setSearchTitle] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        retrieveTutorials(page, limit, title).catch(console.error);
    }, [page, limit, title]);

    const onChangeSearchTitle = (e) => {
        setSearchTitle(e.target.value);
    };
    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(0); // reset to first page whenever limit changes
    };
    const retrieveTutorials = async (pageNumber, pageSize, searchTitleParam) => {
            const response = await TutorialService.getAll(pageNumber, pageSize, searchTitleParam);
            console.log(response.data);
            setTutorials(response.data);
    };

    const refreshList = () => {
        retrieveTutorials(page, limit, title).catch(console.error);
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
            setTitle(searchTitle)
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setCurrentIndex(-1);
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN: SEARCH + LIST */}
            <div className="flex-1">
                <div className="flex mb-4">
                    <form
                        className="flex w-full"
                        onSubmit={(e) => {
                            e.preventDefault(); // prevent page reload
                            findByTitle().catch(console.error);
                            setPage(0);
                        }}
                    >
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
                    </form>
                </div>

                <h4 className="font-bold text-lg mb-2">Tutorials List</h4>
                <div className="mb-4 flex items-center space-x-2">
                    <label
                        htmlFor="limit-select"
                        className="cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-colors"
                    >
                        Tutorials per page:
                    </label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={handleLimitChange}
                        className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
                    {tutorials.tutorials &&
                        tutorials.tutorials.map((tutorial, index) => (
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
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        ← Prev
                    </button>

                    {Array.from({length: tutorials.totalPages}, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-3 py-1 rounded ${
                                page === i ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === tutorials.totalPages - 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
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