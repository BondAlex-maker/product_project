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
app.use(express.static("frontend/dist/client"));

// API
productRoutes(app);
authRoutes(app);
userRoutes(app);

// SSR must be last
app.get("*", async (req, res) => {
    const { render } = await import("./frontend/dist/server/entry-server.js");
    const html = await render(req.url);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
});

// DB
db.sequelize.sync({ alter: true }).then(() => {
    console.log("Synced db.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});
