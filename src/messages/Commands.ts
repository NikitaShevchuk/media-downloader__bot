import MoviesService from "../movies/movies.service";
import StartController from "../start/start.controller";
import { DevCommands } from "./DevCommands";
import { ExpressRequest, ExpressResponse } from "./Types";
import { commandsList } from "./constants/commands-list";

export class Commands extends DevCommands {
    private includesCommand: boolean;
    private request: ExpressRequest;
    private response: ExpressResponse;

    constructor(request: ExpressRequest, response: ExpressResponse) {
        super(request.body?.message?.text as string, request.body?.message?.chat.id || 1);

        this.includesCommand = false;
        this.request = request;
        this.response = response;

        if (this.includesDevCommand) {
            this.includesCommand = true;
            response.status(200).json({});
        } else {
            this.checkIfMessageIncludesCommand();
        }
    }

    public checkIfMessageIncludesCommand() {
        if (this.messageBody === commandsList.start) {
            StartController.start(this.request, this.response);
            this.includesCommand = true;
        } else if (this.messageBody === commandsList.movie) {
            MoviesService.sendInstruction(this.chatId as number);
            this.response.status(200).json({});
            this.includesCommand = true;
        }
    }

    public get messageIncludesCommand(): boolean {
        return this.includesCommand;
    }
}
