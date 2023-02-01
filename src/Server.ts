import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import path from "path";
import downloadRoute from "./download/download-route";
import messagesRoute from "./messages/messages.route";

export const downloadsPath = path.join(__dirname, "../../downloads");

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
