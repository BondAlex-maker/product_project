import { authJwt } from "../middleware/index.js"; // adjust path if needed
import * as controller from "../controllers/user.controller.js";

export default function (app) {
    // Set CORS headers for all requests to this route
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Public route
    app.get("/api/test/all", controller.allAccess);

    // Protected routes
    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
}
