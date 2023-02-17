import { InferSchemaType } from "mongoose";
import DialogWithUser from "../DialogWithUser";
import { UserSchemaType } from "../models/UserSchema";
import UsersHelper from "./users.helper";
import UsersRepository from "./users.repository";

export type UserInDatabase = InferSchemaType<UserSchemaType>;

class UsersService {
    public async getAll(chatId: number) {
        if (!UsersHelper.checkIfUserIsAdmin(chatId)) return;

        try {
            const users = (await UsersRepository.getAll()) || this.getUserNotFoundResult;
            await DialogWithUser.sendMessageToUser(
                chatId,
                `${users.length} users total in database`
            );
            this.sendToUserWithTimeout(chatId, users);
        } catch (error) {
            console.log(error);
            return await DialogWithUser.sendMessageToUser(
                chatId,
                `${UsersHelper.getErrorResult().name}\n\n${UsersHelper.getErrorResult().trailerUrl}`
            );
        }
    }

    private sendToUserWithTimeout(chatId: number, users: UserInDatabase[]) {
        users.forEach((user, movieIndex) =>
            setTimeout(() => {
                DialogWithUser.sendMessageToUser(chatId, UsersHelper.formatUserInfoToString(user));
            }, movieIndex * 200)
        );
    }

    private get getUserNotFoundResult(): UserInDatabase {
        return {
            first_name: "User not found",
            is_bot: false,
            date: 0,
            user_id: 0
        };
    }
}

export default new UsersService();
