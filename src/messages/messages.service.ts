import DialogWithUser from "../DialogWithUser";
import LinksArrayManager from "../downloader/LinksArrayManager";
import YoutubeDownloader from "../downloader/youtube/YoutubeDownloader";
import MoviesService from "../movies/movies.service";
import { CallbackQuery, Message } from "./../Types/Message";
import { Commands } from "./Commands";
import FilterMessage from "./FilterMessage";
import MessagesHelper from "./messages.helper";

class MessagesService {
    public async receiveMessage(message: Message): Promise<void> {
        if (!message.text) return;
        const commands = new Commands(message);
        if (commands.messageIncludesCommand) return;

        if (this.validateId(message.text)) {
            this.processTheMovieId(message.chat.id, message.text);
            return;
        }
        this.processTheLink(message);
    }

    public async receiveCallback(callbackMessage: CallbackQuery | undefined): Promise<void> {
        if (!callbackMessage || !callbackMessage.data) return;
        const [itag, sourceLink] = callbackMessage.data.split(" ");
        if (!itag || !sourceLink) return;
        const downloader = new YoutubeDownloader(sourceLink, callbackMessage.message.chat.id);
        downloader.downloadVideoByLink(Number(itag), Number(callbackMessage.message.message_id));
    }

    private async processTheMovieId(chatId: number, messageBody: string) {
        MoviesService.getByUniqueIdAndSendToUser(chatId, messageBody);
    }

    private async processTheLink(message: Message) {
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

    private validateId(text: string) {
        return /^\d{3}$/.test(text);
    }
}

export default new MessagesService();
