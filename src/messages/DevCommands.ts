import MoviesService from "../movies/movies.service";
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
        if (this.messageBody?.includes(devCommandsList.addMovie)) {
            MoviesService.addNewMovie(this.chatId, this.messageBody);
            this.hasDevCommand = true;
        }
        if (this.messageBody?.includes(devCommandsList.findMovieByName)) {
            MoviesService.getMovieByName(
                this.chatId,
                this.messageBody.replace(devCommandsList.findMovieByName + " ", "")
            );
            this.hasDevCommand = true;
        }
        if (this.messageBody?.includes(devCommandsList.getAllMovies)) {
            MoviesService.getAllMovies(this.chatId);
            this.hasDevCommand = true;
        }
    }

    public get includesDevCommand() {
        return this.hasDevCommand;
    }
}
