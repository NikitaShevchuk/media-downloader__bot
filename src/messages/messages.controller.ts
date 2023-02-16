import { CallbackQuery } from "../Types/Message";
import MoviesService from "../movies/movies.service";
import { Commands } from "./Commands";
import { ExpressRequest, ExpressResponse } from "./Types";
import MessagesService from "./messages.service";

const validateId = (text: string) => /^\d{3}$/.test(text);

class MessagesController {
    public async receiveMessage(request: ExpressRequest, response: ExpressResponse) {
        try {
            if (request.body.message) {
                if (!request.body.message.text) return response.status(200).json({});

                const commands = new Commands(request, response);
                if (commands.messageIncludesCommand) return;

                if (validateId(request.body.message.text)) {
                    MessagesService.receiveMovieId(
                        request.body.message.chat.id,
                        request.body.message.text
                    );
                    return response.status(200).json({});
                }

                await MessagesService.receiveMessage(request.body.message);
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
