import { ExpressRequest, ExpressResponse } from "./Types";
import MessagesService from "./messages.service";

class MessagesController {
    public receiveMessage(request: ExpressRequest, response: ExpressResponse) {
        try {
            if (request.body.message) {
                if (!request.body.message?.text) return response.status(200).json({});
                MessagesService.receiveMessage(request.body.message);
                response.status(200).json({});
            } else if (request.body.callback_query) {
                MessagesService.receiveCallback(request.body?.callback_query);
                response.status(200).json({});
            } else {
                return response.status(404).json({});
            }
        } catch (error) {
            console.log(error);
            response.status(502).json(error);
        }
    }
}

export default new MessagesController();
