import axios from "axios";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithPhoto } from "../../messages/Types";

interface Video {
    url: string;
    poster: string;
}

interface OwnerInfo {
    username: string;
    profile_pic_url: string;
}

interface InstagramVideoResponse {
    media: [Video];
    owner_info: OwnerInfo;
}

export class InstagramDownloader {
    private sourceLink: string;
    private chatId: number;
    private notificationMessageId: number;
    public videoLink?: string;
    public thumbnailLink?: string;
    public author?: string;

    constructor(chatId: number, sourceLink: string, notificationMessageId: number) {
        this.chatId = chatId;
        this.sourceLink = sourceLink;
        this.notificationMessageId = notificationMessageId;
    }

    public async download() {
        try {
            const apiResponse = await axios.get<InstagramVideoResponse>(
                `https://api2.reelsdownloader.io/allinone`,
                {
                    headers: {
                        url: this.sourceLink,
                    },
                }
            );
            this.videoLink = apiResponse.data.media[0].url;
            this.thumbnailLink = apiResponse.data.media[0].poster;
            this.author = apiResponse.data.owner_info.username;
        } catch (error: any) {
            this.videoLink = "Link not found";
        }
    }

    public async sendLinkToUser() {
        DialogWithUser.deleteMessage(this.chatId, this.notificationMessageId);
        if (!this.videoLink) return;

        const messageBody: MessageBodyWithPhoto = {
            photo: this.thumbnailLink || "",
            caption: `Video by: ${this.author}\n\nDownload video via this link: ${this.videoLink}`,
        };
        DialogWithUser.sendPhotoToUser(this.chatId, messageBody);
    }
}
