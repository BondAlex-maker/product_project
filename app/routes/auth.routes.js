import { verifySignUp } from "../middleware/index.js";
import * as controller from "../controllers/auth.controller.js";

export default function (app) {
    // Set CORS headers for all requests to this route
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Signup route
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    // Signin route
    app.post("/api/auth/signin", controller.signin);
}
