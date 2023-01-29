import axios from "axios";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";
import Cheerio from "cheerio";
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
            // const data = { id: this.sourceLink };
            const response = await axios.get(
                `https://dlpanda.com/en?url=${encodeURIComponent(this.sourceLink || "")}`
            );
            const selector = Cheerio.load(response.data);
            // const videoUrl = selector("a[type=no-watermark]").attr("href");
            const videoUrl = selector("source").attr("src");
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
