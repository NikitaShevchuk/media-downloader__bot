import fs from "fs";
import ytdl from "ytdl-core";
import { createTitleAndFileName } from "../messages/utils";
import { apiToken, baseApiUrl } from "../api-connection";
import axios from "axios";

class YoutubeDownloader {
    sourceLink: string;
    chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async downloadVideoByLink(): Promise<void> {
        const videoInfo = await ytdl.getBasicInfo(this.sourceLink);
        const [newMessageWithLink, name] = createTitleAndFileName(
            videoInfo,
            this.chatId
        );
        await new Promise<void>((resolve) => {
            ytdl(this.sourceLink)
                .pipe(fs.createWriteStream(`downloads/${name}.mp4`))
                .on("finish", () => {
                    resolve();
                });
        });
        await axios.post(
            `${baseApiUrl}${apiToken}/sendMessage`,
            newMessageWithLink
        );
        return;
    }
}

export default YoutubeDownloader;
