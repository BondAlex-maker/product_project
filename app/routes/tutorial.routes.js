import * as tutorials from "../controllers/tutorial.controller.js";
import express from "express";

export default (app) => {
    let router = express.Router();

    // Create a new Tutorial
    router.post("/", tutorials.create);

    // Retrieve all Tutorials
    router.get("/", tutorials.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);

    // Update a Tutorial with id
    router.put("/:id", tutorials.update);

    // Delete a Tutorial with id
    router.delete("/:id", tutorials.deleteOne);

    // Delete all Tutorials
    router.delete("/", tutorials.deleteAll);

    // Find all published Tutorials
    router.get("/published", tutorials.findAllPublished);

    app.use("/api/tutorials", router);
};