import express from "express";
import path from "path";
import cors from "cors";
import db from "./app/models/index.js";
import productRoutes from "./app/routes/product.routes.js";
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
app.use("/uploads", express.static(path.join(process.cwd(), "app/storage/uploads")));

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Product Application." });
});

// Routes
productRoutes(app);
authRoutes(app);
userRoutes(app);

// Sync database
db.sequelize.sync({alter: true}).then(() => {
    console.log("Synced db.");
    // initial();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });
//
//     Role.create({
//         id: 2,
//         name: "moderator"
//     });
//
//     Role.create({
//         id: 3,
//         name: "admin"
//     });
// }