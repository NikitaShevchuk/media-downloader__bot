import * as mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 100
        },
        trailerUrl: {
            type: String,
            required: true,
            maxLength: 50
        },
        uniqueId: {
            type: Number,
            required: true,
            maxLength: 3
        }
    },
    { collection: "Movies" }
);

export default mongoose.model("MovieSchema", MovieSchema);
export type MoviesSchemaType = typeof MovieSchema;
