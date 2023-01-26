import axios from "axios";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";

interface InstagramVideoResponse {
    meta: { title: string };
    url: [{ url: string }];
}

export class InstagramDownloader {
    private sourceLink: string;
    private chatId: number;
    private notificationMessageId: number;
    public videoLink?: string;
    public title?: string;

    constructor(chatId: number, sourceLink: string, notificationMessageId: number) {
        this.chatId = chatId;
        this.sourceLink = sourceLink;
        this.notificationMessageId = notificationMessageId;
    }

    public async download() {
        const body = { url: this.sourceLink };
        try {
            const apiResponse = await axios.post<InstagramVideoResponse>(
                `https://ssyoutube.com/api/convert`,
                body
            );

            this.videoLink = apiResponse.data.url[0].url;
            this.title = apiResponse.data?.meta.title;
        } catch (error: any) {
            console.log(error);
            this.videoLink = "Link not found";
        }
    }

    public async sendLinkToUser() {
        DialogWithUser.deleteMessage(this.chatId, this.notificationMessageId);
        if (!this.videoLink) {
            DialogWithUser.sendMessageToUser(this.chatId, "Video link not found");
            return;
        }

        const messageBody: MessageBodyWithVideo = {
            video: this.videoLink,
            caption: `${this.title || ""}`,
        };
        try {
            DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error: any) {
            console.log(error);
            DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }
}
