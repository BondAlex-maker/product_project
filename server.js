import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import tutorialRoutes from "./app/routes/tutorial.routes.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Tutorial Application." });
});

// Routes
tutorialRoutes(app);

// Sync database
db.sequelize.sync().then(() => {
    console.log("Synced db.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});