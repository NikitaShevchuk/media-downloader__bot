import DialogWithUser from "../DialogWithUser";
import { GetFolderTotalSize, SizesEnum } from "./GetFolderTotalSize";

export class AvailableStorage extends GetFolderTotalSize {
    public checkAvailableStorage(): boolean {
        if (process.env.MY_CHAT_ID) {
            DialogWithUser.sendMessageToUser(
                Number(process.env.MY_CHAT_ID),
                `[server storage]: ${this.total}`
            );
        }
        console.log(`[server]: Total server space used: ${this.total}`);
        if (this.total.includes(SizesEnum.TB)) return false;
        if (this.total.includes(SizesEnum.GB)) return false;
        if (this.total.includes(SizesEnum.KB)) return true;
        if (this.total.includes(SizesEnum.MB) && Number(this.total.split(" ")[0]) >= 250) {
            return false;
        } else {
            return true;
        }
    }
}
