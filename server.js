import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import tutorialRoutes from "./app/routes/tutorial.routes.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();
const Role = db.role;

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
authRoutes(app);
userRoutes(app);

// Sync database
db.sequelize.sync({force: true}).then(() => {
    console.log("Synced db.");
    initial();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}