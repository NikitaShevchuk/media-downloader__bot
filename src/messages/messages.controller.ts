import express from "express";
import { CallbackQuery, NewMessageRequest } from "../Types/Message";
import MessagesService from "./messages.service";
import { switchByCommands } from "./switchByCommands";

class MessagesController {
    public async receiveMessage(
        request: express.Request<any, any, NewMessageRequest>,
        response: express.Response
    ) {
        try {
            if (request.body.message) {
                const { includesCommand } = switchByCommands(request, response);
                if (includesCommand) return response.status(200).json({});

                const newMessageResponse = await MessagesService.receiveMessage(request.body);
                response.status(200).json(newMessageResponse);
            } else if (request.body.callback_query) {
                const newMessageResponse = await MessagesService.receiveCallback(
                    request.body as CallbackQuery
                );
                response.status(200).json(newMessageResponse);
            } else {
                return response.status(404).json({});
            }
        } catch (error) {
            response.status(502).json(error);
        }
    }
}

export default new MessagesController();
