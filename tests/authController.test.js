const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRoutes = require("../routes/authRoutes");
const dbPool = require("../db");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

jest.mock("../models/User", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}));

jest.mock("../models/Organisation", () => ({
  createOrganisation: jest.fn(),
  addUserToOrganisation: jest.fn(),
}));

jest.mock("../utils/generateToken", () => jest.fn());

const User = require("../models/User");
const Organisation = require("../models/Organisation");
const generateToken = require("../utils/generateToken");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Register", () => {
    it("should register a new user and return a token", async () => {
      User.findUserByEmail.mockResolvedValue(null);
      User.createUser.mockResolvedValue({ userid: 1 });
      Organisation.createOrganisation.mockResolvedValue({ orgid: 1 });
      Organisation.addUserToOrganisation.mockResolvedValue({});
      generateToken.mockReturnValue("token");

      const response = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("accessToken", "token");
    });

    it("should return an error if email already exists", async () => {
      User.findUserByEmail.mockResolvedValue({});

      const response = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].message).toBe("Email already exists");
    });
  });

  describe("Login", () => {
    it("should log in a user and return a token", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      User.findUserByEmail.mockResolvedValue({
        userid: 1,
        password: hashedPassword,
      });
      jwt.sign = jest.fn().mockReturnValue("token");

      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken", "token");
    });

    it("should return an error if email is not found", async () => {
      User.findUserByEmail.mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });

    it("should return an error if password is incorrect", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      User.findUserByEmail.mockResolvedValue({
        userid: 1,
        password: hashedPassword,
      });

      const response = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });
  });
});

afterAll(async () => {
  await dbPool.end(); // Close the database connection
});
