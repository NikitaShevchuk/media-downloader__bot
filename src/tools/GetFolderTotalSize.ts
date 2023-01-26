import fs from "fs";
import path from "path";

export const SizesEnum = {
    Bytes: "Bytes",
    KB: "KB",
    MB: "MB",
    GB: "GB",
    TB: "TB",
} as const;

export const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

export class GetFolderTotalSize {
    private totalSize: string;
    private directoryPath: string;

    constructor(directoryPath: string) {
        this.directoryPath = directoryPath;
        this.totalSize = this.getTotalSize(this.directoryPath);
    }

    get total() {
        return this.totalSize;
    }

    private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = this.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                arrayOfFiles.push(path.join(__dirname.replace("dist\\src\\tools", dirPath), file));
            }
        });

        return arrayOfFiles;
    }

    private convertBytes(bytes: number): string {
        if (bytes == 0) {
            return "n/a";
        }

        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));

        if (i == 0) {
            return bytes + " " + sizes[i];
        }

        return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
    }

    private getTotalSize(directoryPath: string): string {
        const directoryToCheck = __dirname.replace("dist\\src\\tools", directoryPath);
        const isDownloadsDirectoryExist = fs.existsSync(directoryToCheck);
        console.log(`[server]: directory exist: ${directoryToCheck}`);
        if (!isDownloadsDirectoryExist) {
            fs.mkdirSync(directoryToCheck);
        }
        const arrayOfFiles = this.getAllFiles(directoryPath);

        let totalSize = 0;
        if (arrayOfFiles.length < 1) return "1 KB";
        arrayOfFiles.forEach(function (filePath) {
            totalSize += fs.statSync(filePath).size;
        });

        return this.convertBytes(totalSize);
    }
}
