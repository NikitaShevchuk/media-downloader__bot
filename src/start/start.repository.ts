import { User } from "../Types/User";
import UserSchema from "../models/UserSchema";

class StartRepository {
    public async addNewUserIfNotExists(user: User, date: number) {
        return await UserSchema.updateOne(
            {
                user_id: user.id
            },
            {
                $setOnInsert: {
                    user_id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    date: date,
                    is_bot: user.is_bot,
                    username: user.username
                }
            },
            { upsert: true }
        );
    }
}

export default new StartRepository();
