import MovieSchema from "../models/MovieSchema";
import { NewMovie } from "./Types/NewMovie";

class MoviesRepository {
    public getByUniqueId(uniqueId: string) {
        return MovieSchema.findOne({ uniqueId: Number(uniqueId) });
    }

    public getByName(name: string) {
        return MovieSchema.find({ name: { $regex: name } });
    }

    public getAll() {
        return MovieSchema.find();
    }

    public addNew(newMovie: NewMovie) {
        return MovieSchema.create(newMovie);
    }
}

export default new MoviesRepository();
