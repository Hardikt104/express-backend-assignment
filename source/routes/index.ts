import express from "express";

import authRoute from "./auth.route";
import apiDocsRoute from "./api.docs.route";
import userRoute from "./user.route";

const router = express.Router();

router.use("/api-docs", apiDocsRoute);
router.use("/auth", authRoute);
router.use("/user", userRoute);

export = router;
