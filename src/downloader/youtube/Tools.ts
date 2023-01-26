import fs from "fs";
import ytdl from "ytdl-core";
import { EditMessageBody } from "../../DialogWithUser";
import { MessageBody, createTitleAndFileName } from "../../messages/utils";
import { GetFolderTotalSize, SizesEnum } from "../../tools/GetFolderTotalSize";

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
        return new Promise<DownloadReturnType>((resolve, reject) => {
            const [newMessageWithLink, fileName, link] = createTitleAndFileName(videoInfo);
            const format = ytdl.chooseFormat(videoInfo.formats, {
                quality: itag,
            });
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
                inline_keyboard: [[{ text: "Downloading video...", callback_data: "downloading" }]],
            },
        };
    }

    public checkAvailableStorage(): boolean {
        const folderSize = new GetFolderTotalSize("./downloads");
        console.log(`[server]: Total server space used: ${folderSize.total}`);
        if (folderSize.total.includes(SizesEnum.TB)) return false;
        if (folderSize.total.includes(SizesEnum.GB)) return false;
        if (folderSize.total.includes(SizesEnum.KB)) return true;
        if (
            folderSize.total.includes(SizesEnum.MB) &&
            Number(folderSize.total.split(" ")[0]) >= 300
        ) {
            return false;
        } else {
            return true;
        }
    }
}