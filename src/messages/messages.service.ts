import {
    DeleteMessageResponse,
    SendMessageResponse,
} from "./../Types/SendMessageResponse";
import { prepareLinks } from "./utils";
import { Message } from "./../Types/Message";
import axios from "axios";
import { apiToken, baseApiUrl } from "../api-connection";
import CheckByLinkSource from "./CheckByLinkSource";
import YoutubeDownloader from "../downloader/youtube";

class MessagesService {
    public async receiveMessage(receivedMessage: Message): Promise<void> {
        const chatId = receivedMessage.chat.id;
        const sendMessageResponse = await this.sendMessageToUser(
            chatId,
            "Processing source link..."
        );
        const sourceLinks: string[] = prepareLinks(receivedMessage.text);

        sourceLinks.forEach(async (singleLink) => {
            if (CheckByLinkSource.checkIsLinkYoutube(singleLink)) {
                console.log("downloading video from youtube...");
                const downloader = new YoutubeDownloader(singleLink, chatId);
                await downloader.downloadVideoByLink();
                this.deleteMessage(
                    chatId,
                    sendMessageResponse.result.message_id
                );
            } else if (CheckByLinkSource.checkIsLinkInstagram(singleLink)) {
                // todo: add instagram support
            } else {
                console.log("user provided an invalid link");
                // todo: add contact form for users feedback
                this.sendMessageToUser(
                    chatId,
                    `Resource ${singleLink} is not supported yet.
                    Please contact me if you need it (contact form will be available soon)`
                );
            }
        });
    }

    private async sendMessageToUser(
        chatId: number,
        body: string
    ): Promise<SendMessageResponse> {
        const newMessage = {
            chat_id: chatId,
            text: body,
        };
        return await axios
            .post<SendMessageResponse>(
                `${baseApiUrl}${apiToken}/sendMessage`,
                newMessage
            )
            .then((response) => response.data);
    }

    private async deleteMessage(
        chatId: number,
        messageId: number
    ): Promise<DeleteMessageResponse> {
        const deleteMessageParameter = {
            chat_id: chatId,
            message_id: messageId,
        };
        return await axios
            .post<DeleteMessageResponse>(
                `${baseApiUrl}${apiToken}/deleteMessage`,
                deleteMessageParameter
            )
            .then((response) => response.data);
    }
}

export default new MessagesService();
