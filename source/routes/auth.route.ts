import express, { Request, Response } from "express";

import authController from "../auth/auth.controller";
import validate from "../middlewares/validate";
import authValidation from "../auth/auth.validation";
import auth from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   userRegister :
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         example: text@mailinator.com
 *       password:
 *         type: string
 *         example: Test@123
 */

/**
 * @swagger
 *
 * /api/auth/register:
 *   post:
 *     tags:
 *       - "auth"
 *     description: This api is for user registration 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/userRegister"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Your account is created successfully.
 */
router.post("/register", validate(authValidation.createUser), authController.userCreate);

/**
 * @swagger
 * definitions:
 *   userLogin :
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         example: text@mailinator.com
 *       password:
 *         type: string
 *         example: Test@123
 */

/**
 * @swagger
 *
 * /api/auth/login:
 *   post:
 *     tags:
 *       - "auth"
 *     description: This api is for user login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/userLogin"
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: You have successfully logged in.
 */
router.post("/login", validate(authValidation.login), authController.login);

/**
 * @swagger
 *
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - "auth"
 *     description: This api is get user profile/detail
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Enter the token with the Bearer prefix, e.g. Bearer abcde12345.
 *         required: true
 *         type: string
 *     security:
 *       - parameters: []
 *     responses:
 *       200:
 *         description: User profile get successfully.
 */
router.get("/profile", auth, authController.userProfile);

export = router;