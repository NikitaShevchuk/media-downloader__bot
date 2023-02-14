import express from "express";
import { CallbackQuery, NewMessageRequest } from "../Types/Message";
import MoviesService from "../movies/movies.service";
import MessagesService from "./messages.service";
import { switchByCommands } from "./switchByCommands";

const validateId = (text: string) => /^\d{3}$/.test(text);

class MessagesController {
    public async receiveMessage(
        request: express.Request<any, any, NewMessageRequest>,
        response: express.Response
    ) {
        try {
            if (request.body.message) {
                if (!request.body.message.text) return response.status(200).json({});

                if (switchByCommands(request, response)) return;

                if (validateId(request.body.message.text)) {
                    MoviesService.getMovieByUniqueIdAndSendToUser(
                        request.body.message.chat.id,
                        request.body.message.text
                    );
                    return response.status(200).json({});
                }

                await MessagesService.receiveMessage(request.body);
                response.status(200).json({});
            } else if (request.body.callback_query) {
                await MessagesService.receiveCallback(request.body.callback_query as CallbackQuery);
                response.status(200).json({});
            } else {
                return response.status(404).json({});
            }
        } catch (error) {
            response.status(502).json(error);
        }
    }
}

export default new MessagesController();
