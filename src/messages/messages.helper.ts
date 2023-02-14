import DialogWithUser from "../DialogWithUser";

class MessagesHelper {
    public async sendLoadingStateToUser(chatId: number) {
        return await DialogWithUser.sendMessageToUser(chatId, "Processing source link...");
    }
}

export default new MessagesHelper();
