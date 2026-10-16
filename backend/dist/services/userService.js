"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.findUserById = exports.findAllUsers = exports.createUser = exports.findUserByEmail = void 0;
const database_js_1 = require("../config/database.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const findUserByEmail = async (email) => {
    const { rows } = await (0, database_js_1.query)("SELECT * FROM users WHERE EMAIL = $1", [
        email?.toLocaleLowerCase(),
    ]);
    return rows[0] || null;
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (email, password, role, name, surname, cellphone) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    const { rows } = await (0, database_js_1.query)(`INSERT INTO users (name, surname, email, cellphone, password, role) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, name, surname, email, cellphone, role, "createdat"`, [name, surname, email.toLocaleLowerCase(), cellphone, hashedPassword, role]);
    return rows[0];
};
exports.createUser = createUser;
const findAllUsers = async () => {
    const { rows } = await (0, database_js_1.query)("SELECT id, email, role, name FROM users ORDER BY id DESC");
    return rows;
};
exports.findAllUsers = findAllUsers;
const findUserById = async (id) => {
    const { rows } = await (0, database_js_1.query)("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0] || null;
};
exports.findUserById = findUserById;
const updateUser = async (id, appData) => {
    const { email, role, name, surname, cellphone, password } = appData;
    const { rows } = await (0, database_js_1.query)(`UPDATE users 
         SET email = $1, 
         role = $2,
         name = $3,
         surname = $4,
         cellphone = $5,
         password = $6
         WHERE id = $7
        RETURNING id, name, surname, cellphone, email, role, createdat`, [email, role, name, surname, cellphone, password, id]);
    return rows[0] || null;
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const { rows } = await (0, database_js_1.query)(" DELETE FROM users WHERE id = $1 RETURNING *", [
        id,
    ]);
    return rows[0] || null;
};
exports.deleteUser = deleteUser;
