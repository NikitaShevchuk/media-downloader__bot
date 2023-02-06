import { ObjectId } from "mongoose";

export interface Movie {
    readonly _id?: ObjectId;
    readonly uniqueId?: number;
    name: string;
    trailerUrl: string;
}
