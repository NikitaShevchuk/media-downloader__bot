import { Message } from "../Types/Message";
import MoviesService from "../movies/movies.service";
import StartService from "../start/start.service";
import { DevCommands } from "./DevCommands";
import { commandsList } from "./constants/commands-list";

export class Commands extends DevCommands {
    private includesCommand: boolean;
    private message: Message;

    constructor(message: Message) {
        super(message?.text as string, message?.chat.id || 1);

        this.includesCommand = false;
        this.message = message;

        if (this.includesDevCommand) {
            this.includesCommand = true;
        } else {
            this.checkIfMessageIncludesCommand();
        }
    }

    public checkIfMessageIncludesCommand() {
        if (this.messageBody === commandsList.start) {
            StartService.start(this.message);
            this.includesCommand = true;
        } else if (this.messageBody === commandsList.movie) {
            MoviesService.sendInstruction(this.chatId as number);
            this.includesCommand = true;
        }
    }

    public get messageIncludesCommand(): boolean {
        return this.includesCommand;
    }
}
