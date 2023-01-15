import express from "express";
import messagesController from "./messages.controller";

const messagesRoute = express.Router();

messagesRoute.post("", messagesController.receiveMessage);

export default messagesRoute;
