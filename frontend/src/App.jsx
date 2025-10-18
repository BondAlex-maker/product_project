import {Routes, Route, Link, BrowserRouter} from "react-router-dom";
import TutorialsList from "./pages/TutorialsList";
import AddTutorial from "./pages/AddTutorial";
import Tutorial from "./pages/Tutorial";

function App() {
    return (
        <BrowserRouter>
            <div>
                {/* NAVBAR */}
                <nav className="bg-blue-600 p-4 text-white">
                    <div className="flex space-x-4">
                        <Link to="/tutorials" className="hover:text-gray-300 font-bold">
                            Tutorials
                        </Link>
                        <Link to="/add" className="hover:text-gray-300">
                            Add
                        </Link>
                    </div>
                </nav>

                {/* ROUTES */}
                <div className="container mx-auto mt-8 px-4">
                    <Routes>
                        <Route path="/" element={<TutorialsList />} />
                        <Route path="/tutorials" element={<TutorialsList />} />
                        <Route path="/add" element={<AddTutorial />} />
                        <Route path="/tutorials/:id" element={<Tutorial />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;