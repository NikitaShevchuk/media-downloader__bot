import { Document, Types } from "mongoose";
import DialogWithUser from "../DialogWithUser";
import { movieInstructionBody } from "../start/start.controller";
import MoviesHelper from "./movies.helper";
import MoviesRepository from "./movies.repository";

type Movie = Document<
    unknown,
    any,
    {
        name: string;
        trailerUrl: string;
        uniqueId: number;
    }
> & {
    name: string;
    trailerUrl: string;
    uniqueId: number;
} & {
    _id: Types.ObjectId;
};

class MoviesService {
    public async getMovieByUniqueIdAndSendToUser(chatId: number, uniqueId: string) {
        try {
            const { name, trailerUrl } =
                (await MoviesRepository.getMovieByUniqueId(uniqueId)) ||
                this.getMovieNotFoundResult;

            return await DialogWithUser.sendMessageToUser(chatId, `${name}\n\n${trailerUrl}`);
        } catch (error) {
            console.log(error);
            return await DialogWithUser.sendMessageToUser(
                chatId,
                `${this.getMovieNotFoundResult.name}\n\n${this.getMovieNotFoundResult.trailerUrl}`
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

    public async getMovieByName(chatId: number, movieName: string) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        try {
            const movies =
                (await MoviesRepository.getMovieByName(movieName)) || this.getMovieNotFoundResult;
            const responseToUser = await DialogWithUser.sendMessageToUser(
                chatId,
                `Found ${movies.length} movie by request: "${movieName}"`
            );
            movies.forEach(({ name, trailerUrl, uniqueId }) =>
                DialogWithUser.sendMessageToUser(
                    chatId,
                    `Movie unique code: ${uniqueId}\n\n${name}\n\n${trailerUrl}`
                )
            );
            return responseToUser;
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

    public async getAllMovies(chatId: number) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        try {
            const movies = (await MoviesRepository.getAllMovies()) || this.getMovieNotFoundResult;
            const responseToUser = await DialogWithUser.sendMessageToUser(
                chatId,
                `${movies.length} movies total in database`
            );
            this.sendMoviesToUserWithTimout(chatId, movies);
            return responseToUser;
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

    private async sendMoviesToUserWithTimout(chatId: number, movies: Movie[]) {
        movies.forEach(({ name, trailerUrl, uniqueId }, movieIndex) =>
            setTimeout(() => {
                DialogWithUser.sendMessageToUser(
                    chatId,
                    `Movie unique code: ${uniqueId}\n\n${name}\n\n${trailerUrl}`
                );
            }, movieIndex * 500)
        );
    }

    private get getMovieNotFoundResult() {
        return {
            name: "Movie not found",
            trailerUrl: "Please enter a valid movie code",
            uniqueId: 404
        };
    }
}

export default new MoviesService();
