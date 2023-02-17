import { InferSchemaType } from "mongoose";
import DialogWithUser from "../DialogWithUser";
import { MoviesSchemaType } from "../models/MovieSchema";
import { movieInstructionBody } from "../start/start.service";
import MoviesHelper from "./movies.helper";
import MoviesRepository from "./movies.repository";

type Movie = InferSchemaType<MoviesSchemaType>;

class MoviesService {
    public async getByUniqueIdAndSendToUser(chatId: number, uniqueId: string) {
        try {
            const { name, trailerUrl } =
                (await MoviesRepository.getByUniqueId(uniqueId)) || this.getMovieNotFoundResult;

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
    public async addNew(chatId: number, newMovieString: string) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        const newMovie = MoviesHelper.getNewMovieInstanceOrUndefined(newMovieString);
        if (!newMovie) return MoviesHelper.replyToUserWithUndefinedResult(chatId);

        try {
            const { name, trailerUrl, uniqueId } =
                (await MoviesRepository.addNew(newMovie)) || MoviesHelper.getErrorResult();
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

    public async getByName(chatId: number, movieName: string) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        try {
            const movies =
                (await MoviesRepository.getByName(movieName)) || this.getMovieNotFoundResult;
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

    public async getAll(chatId: number) {
        if (!MoviesHelper.checkIfUserIsAdmin(chatId)) return;

        try {
            const movies = (await MoviesRepository.getAll()) || this.getMovieNotFoundResult;
            const responseToUser = await DialogWithUser.sendMessageToUser(
                chatId,
                `${movies.length} movies total in database`
            );
            this.sendToUserWithTimeout(chatId, movies);
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

    private async sendToUserWithTimeout(chatId: number, movies: Movie[]) {
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
