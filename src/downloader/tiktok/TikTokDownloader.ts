import axios from "axios";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";

export class TikTokDownloader {
    private sourceLink: string;
    private chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async download() {
        try {
            const data = { url: this.sourceLink };
            const response = await axios.post(`https://downloader.bot/api/tiktok/info`, data);
            // const selector = Cheerio.load(response.data);
            // const videoUrl = selector("a[type=no-watermark]").attr("href");
            const videoUrl = response.data.data.mp4;
            console.log(videoUrl);
            const messageBody: MessageBodyWithVideo = {
                video: videoUrl || "",
                caption: videoUrl,
            };
            // if (videoUrl) DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error: any) {
            DialogWithUser.sendErrorMessageToUser(this.chatId);
            console.log(error.response.data);
        }
    }
}
