import DialogWithUser from "../DialogWithUser";
import { movieInstructionBody } from "../start/start.controller";
import MoviesHelper from "./movies.helper";
import MoviesRepository from "./movies.repository";
import { Movie } from "./Types/Movie";

class MoviesService {
    private readonly movieNotFound: Movie;

    constructor() {
        this.movieNotFound = {
            name: "Movie not found",
            trailerUrl: "Please enter a valid movie code"
        };
    }

    public async getMovieByUniqueIdAndSendToUser(chatId: number, uniqueId: string) {
        try {
            const { name, trailerUrl } =
                (await MoviesRepository.getMovieByUniqueId(uniqueId)) || this.movieNotFound;

            return await DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
        } catch (error) {
            console.log(error);
            return await DialogWithUser.sendMessageToUser(
                chatId,
                `${this.movieNotFound.name}\n\n${this.movieNotFound.trailerUrl}`
            );
        }
    }

    // newMovieStaring example: "/addMovie Name https://you.be/trailer"
    public async addNewMovie(chatId: number, newMovieString: string) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        const newMovie = MoviesHelper.getNewMovieInstanceOrUndefined(newMovieString);
        if (!newMovie) return MoviesHelper.replyToUserWithUndifindeResult(chatId);

        try {
            const { name, trailerUrl, uniqueId } =
                (await MoviesRepository.addNewMovie(newMovie)) || MoviesHelper.getErrorResult();
            return DialogWithUser.sendMessageToUser(
                chatId,
                `Successfully added new movie to database\n\nMovie unique code: ${uniqueId}\n\n${name}\n\n${trailerUrl}`
            );
        } catch (error) {
            console.log(error);
            return await DialogWithUser.sendMessageToUser(
                chatId,
                `${MoviesHelper.getErrorResult().name}\n\n${
                    MoviesHelper.getErrorResult().trailerUrl
                }`
            );
        }
    }

    public async sendInstruction(chatId: number) {
        return await DialogWithUser.sendMessageToUser(chatId, movieInstructionBody);
    }
}

export default new MoviesService();
