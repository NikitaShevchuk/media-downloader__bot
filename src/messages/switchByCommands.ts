import express from "express";
import StartController from "../start/start.controller";
import { Message, NewMessageRequest } from "../Types/Message";
import MoviesService from "../movies/movies.service";

interface ReturnType {
    includesCommand: boolean;
}
const includes = { includesCommand: true };
const notIncludes = { includesCommand: false };

export const switchByCommands = (
    request: express.Request<any, any, NewMessageRequest>,
    response: express.Response
): ReturnType => {
    const { text: messageBody, chat } = request.body.message as Message;

    if (messageBody?.includes("/addMovie")) {
        MoviesService.addNewMovie(chat.id, messageBody);
        response.status(200).json({});
        return includes;
    }

    switch (messageBody) {
        case "/start":
            StartController.start(request, response);
            return includes;
        case "/movie":
            MoviesService.sendInstruction(chat.id as number);
            response.status(200).json({});
            return includes;
        default:
            return notIncludes;
    }
};
