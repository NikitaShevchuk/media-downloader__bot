import { QualitySelect } from "./../messages/QualitySelect";
import { SendMessageResponse } from "./../Types/SendMessageResponse";
import fs from "fs";
import ytdl from "ytdl-core";
import { MessageBody, createTitleAndFileName } from "../messages/utils";
import DialogWithUser, { EditMessageBody } from "../DialogWithUser";

class YoutubeDownloader {
    sourceLink: string;
    chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async sendVideoInfoToUser(notificationMessageId: number): Promise<SendMessageResponse> {
        try {
            const videoInfo = await ytdl.getInfo(this.sourceLink);
            const qualitySelect = new QualitySelect(videoInfo, this.chatId);
            return await qualitySelect.sendQualitySelectToUser(notificationMessageId);
        } catch (error) {
            console.log(
                `[server]: error while sending info about a video to user: ${JSON.stringify(error)}`
            );
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }

    public async downloadVideoByLink(
        itag: number,
        messageId: number
    ): Promise<SendMessageResponse> {
        try {
            const newMessageWithLink = await this.startDownload(itag);
            const editMessageBody: EditMessageBody = {
                chatId: this.chatId,
                messageId,
                caption: newMessageWithLink.text,
            };
            return await DialogWithUser.editMessageCaption(editMessageBody);
        } catch (error) {
            console.log(
                `[server]: An error has occurred while video download ${JSON.stringify(error)}`
            );
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }

    private async startDownload(itag: number): Promise<MessageBody> {
        const videoInfo = await ytdl.getInfo(this.sourceLink);
        return new Promise<MessageBody>((resolve, reject) => {
            const [newMessageWithLink, fileName] = createTitleAndFileName(videoInfo);
            const format = ytdl.chooseFormat(videoInfo.formats, {
                quality: itag,
            });
            ytdl(this.sourceLink, { format })
                .pipe(fs.createWriteStream(`downloads/${fileName}.mp4`))
                .on("finish", () => {
                    resolve(newMessageWithLink);
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    }
}

export default YoutubeDownloader;
