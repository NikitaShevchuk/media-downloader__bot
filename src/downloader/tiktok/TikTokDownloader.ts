import axios from "axios";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";
import Cheerio from "cheerio";

export class TikTokDownloader {
    private sourceLink: string;
    private chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async download() {
        try {
            const data = { id: this.sourceLink };
            const response = await axios.post(`https://ttsave.app/download`, data);
            const selector = Cheerio.load(response.data);
            const videoUrl = selector("a[type=no-watermark]").attr("href");
            console.log(videoUrl);
            const messageBody: MessageBodyWithVideo = {
                video: videoUrl || "",
                caption: videoUrl,
            };
            DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error) {
            DialogWithUser.sendErrorMessageToUser(this.chatId);
            console.log(error);
        }
    }
}
