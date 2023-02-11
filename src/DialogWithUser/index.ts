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
        const newMessage = {
            chat_id: chatId,
            text: "Something went wrong :("
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendMessage`, newMessage)
            .then((response) => response.data);
    }

    public async sendPhotoToUser(
        chatId: number,
        body: MessageBodyWithPhoto
    ): Promise<SendMessageResponse> {
        const newMessage = {
            chat_id: chatId,
            photo: body.photo,
            caption: body.caption
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendPhoto`, newMessage)
            .then((response) => response.data);
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
            chat_id: chatId,
            photo: body.photo,
            caption: body.caption,
            resize_keyboard: true,
            reply_markup: { inline_keyboard: body.formatButtons }
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendPhoto`, newMessage)
            .then((response) => response.data);
    }

    public async forwardMessageToMe(messageText: string): Promise<SendMessageResponse | void> {
        if (process.env.MY_CHAT_ID) {
            return this.sendMessageToUser(Number(process.env.MY_CHAT_ID), messageText);
        }
    }
}

export default new DialogWithUser();
