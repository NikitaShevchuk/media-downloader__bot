import DialogWithUser from "../DialogWithUser";
import LinksArrayManager from "../downloader/LinksArrayManager";
import YoutubeDownloader from "../downloader/youtube";
import { CallbackQuery, NewMessageRequest } from "./../Types/Message";
import FilterMessage from "./FilterMessage";

class MessagesService {
    public async receiveMessage(request: NewMessageRequest): Promise<void> {
        if (!request.message) {
            this.receiveCallback(request.callback_query);
            return;
        }
        const chatId = request.message.chat.id;
        const sendMessageResponse = await DialogWithUser.sendMessageToUser(
            chatId,
            "Processing source link..."
        );
        if (process.env.MY_CHAT_ID) {
            DialogWithUser.sendMessageToUser(
                Number(process.env.MY_CHAT_ID),
                `[${request.message.chat.username || request.message.chat.first_name}]: ${
                    request.message.text
                }`
            );
        }
        const linksArray: string[] = FilterMessage.prepareLinks(request.message.text);
        LinksArrayManager.manageLinksArray(
            linksArray,
            chatId,
            sendMessageResponse.result.message_id
        );
    }

    private async receiveCallback(callbackMessage: CallbackQuery | undefined): Promise<void> {
        if (!callbackMessage || !callbackMessage.data) return;
        const [itag, sourceLink] = callbackMessage.data.split(" ");
        const downloader = new YoutubeDownloader(sourceLink, callbackMessage.message.chat.id);
        downloader.downloadVideoByLink(Number(itag), Number(callbackMessage.message.message_id));
    }
}

export default new MessagesService();
