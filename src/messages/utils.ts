import ytdl from "ytdl-core";

export interface MessageBody {
    text: string;
}

export const createTitleAndFileName = (
    videoInfo: ytdl.videoInfo
): [MessageBody, string] => {
    const name = new Date().getTime().toString();
    const title = `${videoInfo.videoDetails.title} by ${videoInfo.videoDetails.author.name}`;
    const newMessageWithLink = {
        text: `${title} \n\nDownload your video from this link: \n${
            process.env.HOST || "http://localhost:80"
        }/download/ngrok-redirect/${name}`,
    };
    return [newMessageWithLink, name];
};
