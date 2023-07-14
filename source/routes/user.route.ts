import express from "express";

import userController from "../user/user.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /api/user/random:
 *   get:
 *     tags:
 *       - "user"
 *     description: This api is returning random user list from third party api.
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random user list get successfully.
 */
router.get("/random", userController.getRandomUser);

export = router;