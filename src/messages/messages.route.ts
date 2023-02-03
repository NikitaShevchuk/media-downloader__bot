import express from "express";
import path from "path";
import { buildPath } from "../Server";
import messagesController from "./messages.controller";

const messagesRoute = express.Router();

messagesRoute.post("", messagesController.receiveMessage);

messagesRoute.get("", (request: express.Request, response: express.Response) => {
    response.sendFile(path.join(buildPath, `index.html`));
});

messagesRoute.get(
    "/portfolio/:fileName",
    (request: express.Request, response: express.Response) => {
        const fileName = request.params.fileName;
        if (!fileName) return response.status(404).json("not found");
        response.sendFile(path.join(buildPath, fileName));
    }
);

messagesRoute.get(
    "/portfolio/static/css/:fileName",
    (request: express.Request, response: express.Response) => {
        const fileName = request.params.fileName;
        if (!fileName) return response.status(404).json("not found");
        response.sendFile(path.join(`${buildPath}/static/css`, fileName));
    }
);

messagesRoute.get(
    "/portfolio/static/js/:fileName",
    (request: express.Request, response: express.Response) => {
        const fileName = request.params.fileName;
        if (!fileName) return response.status(404).json("not found");
        response.sendFile(path.join(`${buildPath}/static/js`, fileName));
    }
);

messagesRoute.get(
    "/portfolio/static/media/:fileName",
    (request: express.Request, response: express.Response) => {
        const fileName = request.params.fileName;
        if (!fileName) return response.status(404).json("not found");
        response.sendFile(path.join(`${buildPath}/static/media`, fileName));
    }
);

export default messagesRoute;
