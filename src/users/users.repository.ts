import UserSchema from "../models/UserSchema";

class UsersRepository {
    public getAll() {
        return UserSchema.find();
    }
}

export default new UsersRepository();
