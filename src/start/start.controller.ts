import DialogWithUser from "../DialogWithUser";
import { startText } from "../constants/start-text";
import express from "express";

class StartController {
    start(request: express.Request, response: express.Response) {
        if (!request.body?.message) {
            response.status(200).json({});
            return;
        }
        DialogWithUser.sendMessageToUser(request.body.message.chat.id, startText, true);
        response.status(200).json({});
    }
}

export default new StartController();
