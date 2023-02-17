import DialogWithUser from "../DialogWithUser";
import { checkIfUserIsAdmin } from "../tools/checkIfUserIsAdmin";
import { notAdminError } from "./../constants/not-admin-error";
import { NewMovie } from "./Types/NewMovie";

class MoviesHelper {
    public getNewMovieInstanceOrUndefined(newMovieString: string): NewMovie | undefined {
        const newItemInfo = newMovieString
            .split("/addMovie")[1]
            ?.split(",")
            .filter((word) => word.trim().length > 0);
        const [name, trailerUrl] = newItemInfo;
        if (!name || !trailerUrl) return undefined;

        const uniqueId = Math.floor(Math.random() * (999 - 100 + 1) + 100);

        return {
            name: name?.replace(/(\s+)/, ""),
            trailerUrl: trailerUrl?.replace(/(\s+)/, ""),
            uniqueId
        };
    }

    public checkIfUserIsAdmin(chatId: number): boolean {
        const userIsAdmin = checkIfUserIsAdmin(chatId);
        if (!userIsAdmin) {
            DialogWithUser.sendMessageToUser(chatId, notAdminError);
        }

        return !!userIsAdmin;
    }

    public replyToUserWithUndefinedResult(chatId: number) {
        const { name, trailerUrl } = this.getErrorResult();
        return DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
    }

    public getErrorResult() {
        return {
            name: "Please enter a movie data in correct format, ",
            trailerUrl: "example: /addMovie Name, https://you.be/trailer"
        };
    }
}

export default new MoviesHelper();
