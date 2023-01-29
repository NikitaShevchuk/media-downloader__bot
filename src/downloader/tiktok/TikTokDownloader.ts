import axios, { AxiosResponse } from "axios";
import fs from "fs";
import internal from "stream";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";

interface FileName {
    fileName: string;
}

export class TikTokDownloader {
    private sourceLink: string;
    private chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async download() {
        try {
            const video = await this.getVideoStream();
            const { fileName } = await this.pipeVideoStream(video);
            const videoPath = `${process.env.HOST || "http://localhost:80"}/download/${fileName}`;
            const messageBody: MessageBodyWithVideo = {
                video: videoPath || "",
                caption: videoPath,
            };
            if (videoPath) DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error: any) {
            DialogWithUser.sendErrorMessageToUser(this.chatId);
            console.log(error);
        }
    }

    private async getVideoStream(): Promise<internal.Readable> {
        const data = { url: this.sourceLink };
        const response = await axios.post(`https://downloader.bot/api/tiktok/info`, data);
        const videoUrl = response.data?.data.mp4;
        return axios
            .get<internal.Readable>(videoUrl, { responseType: "stream" })
            .then((response) => response.data);
    }

    private async pipeVideoStream(video: internal.Readable): Promise<FileName> {
        const fileName = new Date().getTime().toString();
        return new Promise<FileName>((resolve, reject) => {
            video
                .pipe(fs.createWriteStream(`downloads/${fileName}.mp4`))
                .on("finish", () => {
                    resolve({ fileName });
                })
                .on("error", (error) => {
                    console.log(error);
                });
        });
    }
}
