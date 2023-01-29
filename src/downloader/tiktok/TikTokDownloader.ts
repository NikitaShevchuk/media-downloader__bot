import axios from "axios";
import FormData from "form-data";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";
import { getOptions } from "./getOptions";

export class TikTokDownloader {
    private sourceLink: string;
    private chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async download() {
        try {
            // const data = new FormData();
            // data.append("url", this.sourceLink);
            const response = await axios.post(
                `https://api.tikmate.app/api/lookup`,
                getOptions(this.sourceLink)
            );
            const { token, id } = response.data;
            const videoUrl = `https://tikmate.app/download/${token}/${id}.mp4?hd=1`;
            const messageBody: MessageBodyWithVideo = {
                video: videoUrl,
                caption: videoUrl,
            };
            DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error) {
            DialogWithUser.sendErrorMessageToUser(this.chatId);
            console.log(error);
        }
    }
}
