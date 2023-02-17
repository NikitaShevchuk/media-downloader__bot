import MoviesService from "../movies/movies.service";
import UsersService from "../users/users.service";
import { devCommandsList } from "./constants/commands-list";

export class DevCommands {
    public messageBody: string;
    public chatId: number;
    private hasDevCommand: boolean;

    constructor(messageBody: string, chatId: number) {
        this.messageBody = messageBody;
        this.chatId = chatId || 1;
        this.hasDevCommand = false;
        this.checkIfMessageIncludesDevCommand();
    }

    private checkIfMessageIncludesDevCommand() {
        this.hasDevCommand = true;
        if (this.messageBody?.includes(devCommandsList.addMovie)) {
            MoviesService.addNew(this.chatId, this.messageBody);
        } else if (this.messageBody?.includes(devCommandsList.findMovieByName)) {
            MoviesService.getByName(
                this.chatId,
                this.messageBody.replace(devCommandsList.findMovieByName + " ", "")
            );
        } else if (this.messageBody?.includes(devCommandsList.getAllMovies)) {
            MoviesService.getAll(this.chatId);
        } else if (this.messageBody?.includes(devCommandsList.getAllUsers)) {
            UsersService.getAll(this.chatId);
        } else {
            this.hasDevCommand = false;
        }
    }

    public get includesDevCommand() {
        return this.hasDevCommand;
    }
}
