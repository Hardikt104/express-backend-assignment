import request from 'supertest';
import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import httpStatus from "http-status";
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import app from '../source/server';
import User from '../source/models/documets/user.documet';
import AppError from "../source/utils/AppError";
import validate from "../source/middlewares/validate";
import config from '../source/config/config';
import authMiddleware  from '../source/middlewares/auth'
import createResponse from '../source/utils/response';



beforeAll(() => {
    jest.setTimeout(10000); // Set the timeout to 10 seconds for all tests in this suite
    mongoose.connect(config.mongoose.url).then((result: any) => {
        console.info(`Connected to MongoDB in test-${config.mongoose.url}`);
    });
    jest.mock("jsonwebtoken");
    jest.mock("../source/utils/response");
});

describe("auth workflow", () => {
    let userData: {
        email: string;
        password: string
    };
    let wrongUserEmailData: {
        email: string;
        password: string
    };
    let wrongUserPasswordData: {
        email: string;
        password: string
    };
    let userId: string;
    let accessToken: string;

    beforeEach(async () => {
        userData = {
            email: 'test@mailinator.com',
            password: 'admin@123'
        };
        wrongUserEmailData = {
            email: 'wrong@mailinator.com',
            password: 'admin@123'
        };
        wrongUserPasswordData = {
            email: 'test@mailinator.com',
            password: 'wrongpassword'
        };
    });

    it("should register a new user", async () => {

        const res = await request(app).post("/api/auth/register").send(userData);
        userId = res.body.data._id;
        expect(res.body.message).toEqual("Your account is created successfully");
        expect(res.body.status).toEqual(200);
    });

    it("should check if user is already exist", async () => {

        const res = await request(app).post("/api/auth/register").send(userData);
        expect(res.body.message).toEqual("This email address is already registered with us. Please use another email address.");
        expect(res.body.status).toEqual(400);
    });

    it("should login a user with valid credentials", async () => {

        const res = await request(app).post("/api/auth/login").send(userData);
        accessToken = res.body.data.tokens.access.token;
        expect(res.body.message).toEqual("You have successfully logged in");
        expect(res.body.status).toEqual(200);
    });

    it("should check wrong email address entered by user", async () => {

        const res = await request(app).post("/api/auth/login").send(wrongUserEmailData);
        expect(res.body.message).toEqual("Sorry! We couldn't find an account associated with this email address.");
        expect(res.body.status).toEqual(400);
    });

    it("should check wrong password entered by user", async () => {

        const res = await request(app).post("/api/auth/login").send(wrongUserPasswordData);
        expect(res.body.message).toEqual("Incorrect password. Please try again or click on 'Forgot Password' below.");
        expect(res.body.status).toEqual(400);
    });

    it("should return the user's profile if a valid token is provided", async () => {

        const response = await request(app)
            .get("/api/auth/profile")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("User profile get successfully");
    });

    afterAll(async () => {
        await User.findByIdAndDelete(userId); // Cleanup

    });

});

describe("get random user with third party", () => {

    it("should return a random user from  random user generator api", async () => {
        const response = await request(app).get("/api/user/random");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Random user get successfully");
    });
})

describe("validate middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call next function when validation passes", () => {
        const schema = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().required(),
            }),
        };

        req.body = {
            name: "John Doe",
            age: 30,
        };

        validate(schema)(req as Request, res as Response, next);
    });

    test("should call next function with AppError when validation fails", () => {
        const schema = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().required(),
            }),
        };

        req.body = {
            name: "John Doe",
            // Missing required 'age' field
        };

        validate(schema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(
            expect.any(AppError)
        );

        const appError: AppError = next.mock.calls[0][0];
        expect(appError.statusCode).toBe(httpStatus.BAD_REQUEST);
        expect(appError.message).toContain("age");
    });
});

describe("database workflow", () => {
    let userData: {
        email: string;
        password: string
    };
    let userId: string;
    let accessToken: string;

    beforeEach(async () => {
        userData = {
            email: 'test@mailinator.com',
            password: 'admin@123'
        };
    });

    it("should register a new user", async () => {

        const res = await request(app).post("/api/auth/register").send(userData);
        userId = res.body.data._id;
        expect(res.body.message).toEqual("Your account is created successfully");
        expect(res.body.status).toEqual(200);

        const user = await User.findOne({ _id: res.body.data._id });
        expect(user).toBeTruthy();
        expect(user?.email).toBe(userData.email);
    });

    it("should login a user with valid credentials", async () => {

        const userDataForLogin = {
            email: 'testLogin@example.com',
            password: 'test@123',
        };
        const password = await bcrypt.hash(userDataForLogin.password, 8);
        const userCreate = await User.create({
            email: userDataForLogin.email.toLowerCase(),
            password: password
        })
        const res = await request(app).post("/api/auth/login").send(userDataForLogin);
        accessToken = res.body.data.tokens.access.token;
        expect(res.body.message).toEqual("You have successfully logged in");
        expect(res.body.status).toEqual(200);
        expect(res.body.data.user.email).toBe(userCreate.email);
    });

    it("should return the user's profile if a valid token is provided", async () => {

        const response = await request(app)
            .get("/api/auth/profile")
            .set("Authorization", `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("User profile get successfully");
    });

    afterAll(async () => {
        await User.findByIdAndDelete(userId); // Cleanup
    });

});

describe("auth middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    let accessToken: string;
    let userId:string

    it("should login a user with valid credentials", async () => {

        const userDataForLogin = {
            email: 'testLogin@example.com',
            password: 'test@123',
        };
        const password = await bcrypt.hash(userDataForLogin.password, 8);
        const userCreate = await User.create({
            email: userDataForLogin.email.toLowerCase(),
            password: password
        })
        const res = await request(app).post("/api/auth/login").send(userDataForLogin);
        accessToken = res.body.data.tokens.access.token;
        userId = res.body.data.user._id;
        expect(res.body.message).toEqual("You have successfully logged in");
        expect(res.body.status).toEqual(200);
        expect(res.body.data.user.email).toBe(userCreate.email);
    });

    test("should call next function and set loggedInUser when valid token is provided", () => {
        const token = `Bearer ${accessToken}`;
        req.header = jest.fn().mockReturnValue(token);
        authMiddleware(req as Request, res as Response, next);
        expect(req.loggedInUser).toEqual({ id: userId });
    });
});