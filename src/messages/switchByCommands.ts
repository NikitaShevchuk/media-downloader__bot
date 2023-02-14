import express from "express";
import { Message, NewMessageRequest } from "../Types/Message";
import MoviesService from "../movies/movies.service";
import StartController from "../start/start.controller";

export const switchByCommands = (
    request: express.Request<any, any, NewMessageRequest>,
    response: express.Response
): boolean => {
    const { text: messageBody, chat } = request.body.message as Message;

    if (messageBody?.includes("/addMovie")) {
        MoviesService.addNewMovie(chat.id, messageBody);
        response.status(200).json({});
        return true;
    }

    if (messageBody?.includes("/findMovieByName")) {
        MoviesService.getMovieByName(chat.id, messageBody.replace("/findMovieByName ", ""));
        response.status(200).json({});
        return true;
    }

    if (messageBody?.includes("/getAllMovies")) {
        MoviesService.getAllMovies(chat.id);
        response.status(200).json({});
        return true;
    }

    switch (messageBody) {
        case "/start":
            StartController.start(request, response);
            return true;
        case "/movie":
            MoviesService.sendInstruction(chat.id as number);
            response.status(200).json({});
            return true;
        default:
            return false;
    }
};
