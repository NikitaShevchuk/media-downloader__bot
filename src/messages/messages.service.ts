import DialogWithUser from "../DialogWithUser";
import LinksArrayManager from "../downloader/LinksArrayManager";
import YoutubeDownloader from "../downloader/youtube/YoutubeDownloader";
import { CallbackQuery, NewMessageRequest } from "./../Types/Message";
import FilterMessage from "./FilterMessage";
import MessagesHelper from "./messages.helper";

class MessagesService {
    public async receiveMessage(request: NewMessageRequest): Promise<void> {
        if (!request.message) return;
        const chatId = request.message.chat.id;
        DialogWithUser.forwardMessageToMe(request.message.chat.id, request.message.message_id);

        const notificationMessageId = await MessagesHelper.sendLoadingStateToUser(chatId);
        const linksArray: string[] = FilterMessage.prepareLinks(request.message.text);

        LinksArrayManager.manageLinksArray(
            linksArray,
            chatId,
            notificationMessageId.result.message_id
        );
    }

    public async receiveCallback(callbackMessage: CallbackQuery | undefined): Promise<void> {
        if (!callbackMessage || !callbackMessage.data) return;
        const [itag, sourceLink] = callbackMessage.data.split(" ");
        const downloader = new YoutubeDownloader(sourceLink, callbackMessage.message.chat.id);
        downloader.downloadVideoByLink(Number(itag), Number(callbackMessage.message.message_id));
    }
}

export default new MessagesService();
