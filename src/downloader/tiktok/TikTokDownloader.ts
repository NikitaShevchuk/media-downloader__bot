import axios from "axios";
import fs from "fs";
import internal from "stream";
import DialogWithUser from "../../DialogWithUser";
import { MessageBodyWithVideo } from "../../messages/Types";
import { AvailableStorage } from "../../tools/CheckAvailableStorage";

interface FileName {
    fileName: string;
}

interface VideoStreamReturnType {
    video: internal.Readable;
    videoUrl: string;
}

export class TikTokDownloader {
    private sourceLink: string;
    private chatId: number;
    private notificationMessageId: number;

    constructor(sourceLink: string, chatId: number, notificationMessageId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
        this.notificationMessageId = notificationMessageId;
    }

    public async download() {
        DialogWithUser.deleteMessage(this.chatId, this.notificationMessageId);
        if (!this.checkStorage()) return;
        try {
            const { video, videoUrl } = await this.getVideoStream();
            const { fileName } = await this.pipeVideoStream(video);
            const videoPath = `${process.env.HOST || "http://localhost:80"}/download/${fileName}`;
            const messageBody: MessageBodyWithVideo = {
                video: videoPath || "",
                caption: videoUrl
            };
            if (videoPath) DialogWithUser.sendVideoToUser(this.chatId, messageBody);
        } catch (error: any) {
            DialogWithUser.sendErrorMessageToUser(this.chatId);
            console.log(error);
        }
    }

    private async getVideoStream(): Promise<VideoStreamReturnType> {
        const data = { url: this.sourceLink };
        const response = await axios.post(`https://downloader.bot/api/tiktok/info`, data);
        const videoUrl = response.data?.data.mp4;
        const video = await axios
            .get<internal.Readable>(videoUrl, { responseType: "stream" })
            .then((response) => response.data);
        return { video, videoUrl };
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
                    reject(error);
                    console.log(error);
                });
        });
    }

    private async checkStorage() {
        const storage = new AvailableStorage("./downloads");
        if (storage.checkAvailableStorage()) {
            return true;
        } else {
            DialogWithUser.sendMessageToMe("Server storage is full!");
            await DialogWithUser.sendMessageToUser(this.chatId, "Server storage is full");
            return false;
        }
    }
}
