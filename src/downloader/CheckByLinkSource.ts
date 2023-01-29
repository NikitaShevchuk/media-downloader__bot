import { supportedSources } from "../constants/supported-sources";

class CheckByLinkSource {
    public isYoutube(link: string): boolean {
        return !!supportedSources.youtube.find((source) => link.includes(source));
    }

    public isInstagram(link: string): boolean {
        return !!supportedSources.instagram.find((source) => link.includes(source));
    }

    public isTikTok(link: string): boolean {
        return !!supportedSources.tiktok.find((source) => link.includes(source));
    }
}

export default new CheckByLinkSource();
