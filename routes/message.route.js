import express from "express";
//import { sendMessage } from "../controllers/message.controller.js";
import { getMessages } from "../controllers/message.controller.js";
import { getMessages2 } from "../controllers/message.controller.js";    

const Router = express.Router();

{/*Router.post("/send/:receiverid", sendMessage); */}
Router.get("/get/:receiverid", getMessages);
Router.get("/get2", getMessages2);

export default Router;