import express from "express";
import path from "path";
import { downloadsPath } from "../Server";

const downloadRoute = express.Router();

downloadRoute.get(
    "/:title",
    (request: express.Request, response: express.Response) => {
        const { title } = request.params;
        if (!title) response.status(200).json({});
        response.sendFile(path.join(downloadsPath, `${title}.mp4`));
    }
);
// this route use to redirect user to prevent ngrok warning
downloadRoute.get(
    "/ngrok-redirect/:title",
    (request: express.Request, response: express.Response) => {
        const { title } = request.params;
        if (!title) response.status(200).json({});
        response.header(
            "ngrok-skip-browser-warning",
            "ngrok-skip-browser-warning"
        );
        response.redirect(`/download/${title}`);
    }
);

export default downloadRoute;
