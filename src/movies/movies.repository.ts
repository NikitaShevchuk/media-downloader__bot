import MovieSchema from "../models/MovieSchema";
import { NewMovie } from "./Types/NewMovie";

class MoviesRepository {
    public async getMovieByUniqueId(uniqueId: string) {
        return await MovieSchema.findOne({ uniqueId: Number(uniqueId) });
    }

    public async addNewMovie(newMovie: NewMovie) {
        return await MovieSchema.create(newMovie);
    }
}

export default new MoviesRepository();
