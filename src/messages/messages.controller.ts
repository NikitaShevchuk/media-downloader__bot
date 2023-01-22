import express from "express";
import MessagesService from "./messages.service";
import { NewMessageRequest } from "../Types/Message";
import StartController from "../start/start.controller";

class MessagesController {
    public async receiveMessage(
        request: express.Request<any, any, NewMessageRequest>,
        response: express.Response
    ) {
        if (!request.body.message && !request.body.callback_query) {
            return response.status(200).json({});
        }
        if (request.body.message?.text === "/start") {
            return StartController.start(request, response);
        }
        try {
            const newMessageResponse = await MessagesService.receiveMessage(request.body);
            response.status(200).json(newMessageResponse);
        } catch (error) {
            response.status(502).json(error);
        }
    }
}

export default new MessagesController();
