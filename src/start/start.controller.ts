import DialogWithUser from "../DialogWithUser";
import { startText } from "../constants/start-text";
import express from "express";

export const movieInstructionBody =
    "Send me a movie code to get a trailer (3-digit code, example: 111)";

class StartController {
    async start(request: express.Request, response: express.Response) {
        if (!request.body?.message) {
            response.status(200).json({});
            return;
        }
        DialogWithUser.sendMessageToUser(request.body.message.chat.id, startText, true);
        DialogWithUser.sendMessageToUser(request.body.message.chat.id, movieInstructionBody, true);
        response.status(200).json({});
    }
}

export default new StartController();
