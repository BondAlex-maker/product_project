import { authJwt } from "../middleware/index.js";
import * as products from "../controllers/product.controller.js";
import { upload } from "../middleware/imageUpload.js";
export default function (app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
        products.create
    );

    app.get(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findAll
    );

    app.get(
        "/api/products/common",
        // [authJwt.verifyToken, authJwt.isAdmin],
        products.findAllCommon
    );

    app.get(
        "/api/products/alcohol",
        // [authJwt.verifyToken, authJwt.isAdmin],
        products.findAllAlcohol
    );

    app.get(
        "/api/products/edit/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.findOne
    );

    app.put(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isAdmin, upload.single("image")],
        products.update
    );

    app.delete(
        "/api/products/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.deleteOne
    );

    app.delete(
        "/api/products",
        [authJwt.verifyToken, authJwt.isAdmin],
        products.deleteAll
    );
}
