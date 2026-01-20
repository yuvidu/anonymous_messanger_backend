import express from "express";
import { signup } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";

const Router = express.Router();

Router.post("/signup", signup);
Router.post("/login",login)

export default Router;
