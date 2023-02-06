import express from "express";
import StartController from "../start/start.controller";
import { NewMessageRequest } from "../Types/Message";
import MoviesController from "../movies/movies.controller";

interface ReturnType {
    includesCommand: boolean;
}
const includes = { includesCommand: true };
const notIncludes = { includesCommand: false };

export const switchByCommands = (
    request: express.Request<any, any, NewMessageRequest>,
    response: express.Response
): ReturnType => {
    const messageBody = request.body.message?.text;
    if (!messageBody) return notIncludes;

    switch (messageBody) {
        case "/start":
            StartController.start(request, response);
            return includes;
        case "/movie":
            MoviesController.sendInstruction(request);
            return includes;
        default:
            return notIncludes;
    }
};
