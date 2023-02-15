import express from "express";
import { NewMessageRequest } from "./../Types/Message";
import StartService from "./start.service";

class StartController {
    async start(request: express.Request<any, any, NewMessageRequest>, response: express.Response) {
        if (!request.body?.message) {
            response.status(200).json({});
            return;
        }
        StartService.start(request.body.message, request.body.message.from);
        response.status(200).json({});
    }
}

export default new StartController();
