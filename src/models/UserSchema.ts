import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            maxLength: 100
        },
        last_name: {
            type: String,
            required: false,
            maxLength: 100
        },
        user_id: {
            type: Number,
            required: true,
            maxLength: 50
        },
        username: {
            type: String,
            required: false,
            maxLength: 100
        },
        is_bot: {
            type: Boolean,
            required: true
        },
        date: {
            type: Number,
            required: true,
            maxLength: 50
        }
    },
    { collection: "Users" }
);

export default mongoose.model("UserSchema", UserSchema);
export type UserSchemaType = typeof UserSchema;
