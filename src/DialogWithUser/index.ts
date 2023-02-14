import axios from "axios";
import { SendMessageResponse } from "../Types/SendMessageResponse";
import { apiToken, baseApiUrl } from "../api-connection";
import {
    MessageBodyWithPhoto,
    MessageBodyWithVideo,
    MessageRequestBodyWithVideo
} from "../messages/Types";
import { BasicMessageActions } from "./BasicMessageActions";

export const axiosInstance = axios.create({ baseURL: `${baseApiUrl}${apiToken}` });

class DialogWithUser extends BasicMessageActions {
    public async sendErrorMessageToUser(chatId: number): Promise<SendMessageResponse> {
        return await this.sendMessageToUser(chatId, "Something went wrong :(");
    }

    public async sendPhotoToUser(
        chatId: number,
        body: MessageBodyWithPhoto
    ): Promise<SendMessageResponse> {
        const newMessage = {
            photo: body.photo,
            caption: body.caption
        };
        return await this.requestTelegramApi(`/sendPhoto`, chatId, newMessage);
    }

    public async sendVideoToUser(
        chatId: number,
        body: MessageBodyWithVideo
    ): Promise<SendMessageResponse> {
        this.sendAction(chatId, "upload_video");
        const newMessage: MessageRequestBodyWithVideo = {
            chat_id: chatId,
            video: body.video
        };
        if (body.caption && body.caption.length < 1020) newMessage.caption = body.caption;
        return await axiosInstance
            .post<SendMessageResponse>(`/sendVideo`, newMessage)
            .then((response) => response.data);
    }

    public async sendPhotoWithButtonsToUser(
        chatId: number,
        body: MessageBodyWithPhoto
    ): Promise<SendMessageResponse> {
        const newMessage = {
            photo: body.photo,
            caption: body.caption,
            resize_keyboard: true,
            reply_markup: { inline_keyboard: body.formatButtons }
        };
        return await this.requestTelegramApi(`/sendPhoto`, chatId, newMessage);
    }

    public async forwardMessageToMe(
        chatId: number,
        messageId: number
    ): Promise<SendMessageResponse | void> {
        if (process.env.MY_CHAT_ID) {
            return this.forwardMessage(Number(process.env.MY_CHAT_ID), chatId, messageId);
        }
    }

    public async sendMessageToMe(message: string): Promise<SendMessageResponse | void> {
        if (process.env.MY_CHAT_ID) {
            return this.sendMessageToUser(Number(process.env.MY_CHAT_ID), message);
        }
    }
}

export default new DialogWithUser();
