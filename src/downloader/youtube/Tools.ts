import fs from "fs";
import ytdl from "ytdl-core";
import { EditMessageBody } from "../../DialogWithUser/Types";
import { MessageBody, createTitleAndFileName } from "../../messages/utils";

interface DownloadReturnType {
    newMessageWithLink: MessageBody;
    link: string;
}

export class Tools {
    public sourceLink: string;
    public chatId: number;

    constructor(sourceLink: string, chatId: number) {
        this.sourceLink = sourceLink;
        this.chatId = chatId;
    }

    public async startDownload(itag: number): Promise<DownloadReturnType> {
        const videoInfo = await ytdl.getInfo(this.sourceLink);
        const format = ytdl.chooseFormat(videoInfo.formats, {
            quality: itag
        });
        const [newMessageWithLink, fileName, link] = createTitleAndFileName(videoInfo);
        return new Promise<DownloadReturnType>((resolve, reject) => {
            ytdl(this.sourceLink, { format })
                .pipe(fs.createWriteStream(`downloads/${fileName}.mp4`))
                .on("finish", () => {
                    resolve({ newMessageWithLink, link });
                })
                .on("error", (error: any) => {
                    reject(error);
                });
        });
    }

    public createMessageWithLoadingState(messageId: number): EditMessageBody {
        return {
            chatId: this.chatId,
            messageId,
            replyMarkup: {
                resize_keyboard: true,
                inline_keyboard: [[{ text: "Downloading video...", callback_data: "downloading" }]]
            }
        };
    }
}
