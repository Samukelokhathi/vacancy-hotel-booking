"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = exports.googleLogin = exports.login = exports.register = void 0;
const UserService = __importStar(require("../services/userService.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const createToken = (user) => jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
const register = async (req, res) => {
    const { email, password, name, surname, cellphone } = req.body;
    if (!email || !password || !name || !surname || !cellphone) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        const user = await UserService.createUser(email, password, "client", name, surname, cellphone);
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Register Error Details:", error);
        res.status(500).json({ message: "Error registering the user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await UserService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        console.log(`User ${email} logged in successfully`);
        const { password: _pw, ...safeUser } = user;
        return res.status(200).json({ message: "Login Successful", token, user: safeUser });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
};
exports.login = login;
const googleLogin = async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
    }
    // 1. check the token really came from Google, for our app
    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid Google sign-in" });
    }
    if (!payload?.email || !payload.email_verified) {
        return res.status(401).json({ message: "Google email is not verified" });
    }
    // 2. find the user, or create a new client account
    try {
        let user = await UserService.findUserByEmail(payload.email);
        if (!user) {
            user = await UserService.createGoogleUser(payload.email, payload.given_name ?? payload.name ?? "Google", payload.family_name ?? "");
        }
        return res
            .status(200)
            .json({ message: "Login Successful", token: createToken(user) });
    }
    catch (error) {
        console.error("Google Login Error:", error);
        return res.status(500).json({ message: "Error logging in with Google" });
    }
};
exports.googleLogin = googleLogin;
const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.findAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Error retrieving users" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await UserService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password: _pw, ...safeUser } = user;
        return res.status(200).json(safeUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
};
exports.getUserById = getUserById;
const updateUserById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        if (req.user.role !== "admin") {
            req.body.role = req.user.role;
        }
        const updatedUser = await UserService.updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
};
exports.updateUserById = updateUserById;
const deleteUserById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deletedUser = await UserService.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting the user" });
    }
};
exports.deleteUserById = deleteUserById;
