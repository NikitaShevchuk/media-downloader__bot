import DialogWithUser from "../DialogWithUser";
import LinksArrayManager from "../downloader/LinksArrayManager";
import YoutubeDownloader from "../downloader/youtube/YoutubeDownloader";
import MoviesService from "../movies/movies.service";
import { CallbackQuery, Message } from "./../Types/Message";
import FilterMessage from "./FilterMessage";
import MessagesHelper from "./messages.helper";

class MessagesService {
    public async receiveMessage(message: Message): Promise<void> {
        if (!message) return;
        const chatId = message.chat.id;
        DialogWithUser.forwardMessageToMe(message.chat.id, message.message_id);

        const notificationMessageId = await MessagesHelper.sendLoadingStateToUser(chatId);
        const linksArray: string[] = FilterMessage.prepareLinks(message.text);

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

    public async receiveMovieId(chatId: number, messageBody: string) {
        MoviesService.getMovieByUniqueIdAndSendToUser(chatId, messageBody);
    }
}

export default new MessagesService();
