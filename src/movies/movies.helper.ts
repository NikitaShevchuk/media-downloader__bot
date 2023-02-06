import DialogWithUser from "../DialogWithUser";
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
        const adminsList = process.env.ADMINS_LIST;
        const userIsAdmin = adminsList && adminsList.split(",").find((id) => id === String(chatId));

        if (!userIsAdmin) {
            const { name, trailerUrl } = this.getNotAdminError();
            DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
        }

        return !!userIsAdmin;
    }

    public replyToUserWithUndifindeResult(chatId: number) {
        const { name, trailerUrl } = this.getErrorResult();
        return DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
    }

    public getErrorResult() {
        return {
            name: "Please enter a movie data in correct format, ",
            trailerUrl: "example: /addMovie Name, https://you.be/trailer"
        };
    }

    private getNotAdminError() {
        return {
            name: "You don't have permission to perform this action",
            trailerUrl: "Authorize as Administrator to add new movies"
        };
    }
}

export default new MoviesHelper();
