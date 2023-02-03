import express from "express";
import path from "path";
import { buildPath } from "../Server";
import messagesController from "./messages.controller";

const messagesRoute = express.Router();

messagesRoute.post("", messagesController.receiveMessage);
messagesRoute.get("", (request: express.Request, response: express.Response) => {
    response.sendFile(path.join(buildPath, `index.html`));
});

export default messagesRoute;
