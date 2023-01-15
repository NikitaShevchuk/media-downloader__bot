import express from "express";
import MessagesService from "./messages.service";
import { NewMessageRequest } from "../Types/Message";

class MessagesController {
    public async receiveMessage(
        request: express.Request<any, any, NewMessageRequest>,
        response: express.Response
    ) {
        console.log(
            `[server]: new message from ${request.body?.message.from.username}:
             ${request.body?.message.text}`
        );
        try {
            const newMessageResponse = MessagesService.receiveMessage(
                request.body.message
            );
            response.status(200).json(newMessageResponse);
        } catch (error) {
            response.status(502).json(error);
        }
    }
}

export default new MessagesController();
