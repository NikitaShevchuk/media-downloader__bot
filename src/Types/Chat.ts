export interface Chat {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    type: "private" | "group" | "supergroup" | "channel";
}
