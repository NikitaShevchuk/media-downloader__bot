import DialogWithUser from "../DialogWithUser";
import { checkIfUserIsAdmin } from "../tools/checkIfUserIsAdmin";
import { UserInDatabase } from "./users.service";

class UsersHelper {
    public checkIfUserIsAdmin(chatId: number): boolean {
        const userIsAdmin = checkIfUserIsAdmin(chatId);
        if (!userIsAdmin) {
            const { name, trailerUrl } = this.getErrorResult();
            DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
        }

        return !!userIsAdmin;
    }

    public getErrorResult() {
        return {
            name: "Please enter a movie data in correct format, ",
            trailerUrl: "example: /addMovie Name, https://you.be/trailer"
        };
    }

    public formatUserInfoToString({
        username,
        first_name,
        is_bot,
        date,
        user_id,
        last_name
    }: UserInDatabase): string {
        const formattedDate = this.getFormattedDate(date);

        return `${username ? `${`username: @${username}`}` : ""}\n\n${
            first_name ? `full name: ${first_name} ${last_name || ""}` : ""
        }\n\nis_bot: ${is_bot}\n\njoined at: ${formattedDate}\n\nuser_id: ${user_id}`;
    }

    private getFormattedDate(date: number): string {
        const dateInstance = new Date(date * 1000);
        return dateInstance.toLocaleDateString();
    }
}

export default new UsersHelper();
