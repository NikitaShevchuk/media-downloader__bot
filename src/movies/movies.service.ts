import DialogWithUser from "../DialogWithUser";
import { movieInstructionBody } from "../start/start.controller";

class MoviesService {
    public getMovieByUniqueId(chatId: number, movieUniqueCode: number) {}

    public async sendInstruction(chatId: number) {
        return await DialogWithUser.sendMessageToUser(chatId, movieInstructionBody);
    }
}

export default new MoviesService();
