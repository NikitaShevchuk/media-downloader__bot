import { supportedSources } from "../constants/supported-sources";

class CheckByLinkSource {
    public checkIsLinkYoutube(link: string): boolean {
        return !!supportedSources.youtube.find((source) =>
            link.includes(source)
        );
    }
    public checkIsLinkInstagram(link: string): boolean {
        return !!supportedSources.instagram.find((source) =>
            link.includes(source)
        );
    }
}

export default new CheckByLinkSource();
