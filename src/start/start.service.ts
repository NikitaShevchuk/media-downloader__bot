import DialogWithUser from "../DialogWithUser";
import { Message } from "../Types/Message";
import { User } from "../Types/User";
import { startText } from "../constants/start-text";
import startRepository from "./start.repository";

export const movieInstructionBody =
    "Send me a movie code to get a trailer (3-digit code, example: 111)";

class StartService {
    public async start(message: Message) {
        await DialogWithUser.sendMessageToUser(message.chat.id, startText, true);
        DialogWithUser.sendMessageToUser(message.chat.id, movieInstructionBody);
        startRepository.addNewUserIfNotExists(message.from, message.date);
    }
}

export default new StartService();
