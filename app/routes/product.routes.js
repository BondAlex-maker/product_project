import { authJwt } from "../middleware/index.js";
import * as products from "../controllers/product.controller.js";
import { upload } from "../middleware/imageUpload.js";
export default function (app) {
    // Set CORS headers for all requests to these routes
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new Product
    app.post(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
        products.create
    );

    // Retrieve all Products
    app.get(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findAll
    );

    // Retrieve all Common Products
    app.get(
        "/api/products/common",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findAllCommon
    );

    // Retrieve all Alcoholic Products
    app.get(
        "/api/products/alcohol",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findAllAlcohol
    );

    // Retrieve a single Product by ID
    app.get(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findOne
    );

    // Update a Product by ID
    app.put(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.update
    );

    // Delete a Product by ID
    app.delete(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.deleteOne
    );

    // Delete all Products
    app.delete(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.deleteAll
    );
}
