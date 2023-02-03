import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import path from "path";
import downloadRoute from "./download/download-route";
import messagesRoute from "./messages/messages.route";

export const downloadsPath = path.join(__dirname, "../../downloads");
export const buildPath = path.join(__dirname, "../../build");

class ExpressServer {
    private app: Application;
    readonly port: number;
    private paths: {
        message: string;
        download: string;
    };

    constructor() {
        this.app = express();
        this.port = (process.env.PORT as unknown as number) || 8000;
        this.paths = {
            message: "",
            download: "/download",
        };
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(express.static(downloadsPath));
        this.app.use(express.static(buildPath));
        this.app.use(express.static(`${buildPath}/static`));
        this.app.use(express.static(`${buildPath}/static/js`));
        this.app.use(express.static(`${buildPath}/static/css`));
        this.app.use(express.static(`${buildPath}/static/media`));
    }

    routes() {
        this.app.use(this.paths.message, messagesRoute);
        this.app.use(this.paths.download, downloadRoute);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`[server]: Server is running at https://localhost:${this.port}`);
        });
    }
}

export default ExpressServer;
